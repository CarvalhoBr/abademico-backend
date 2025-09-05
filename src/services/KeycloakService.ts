import { CreateKeycloakUser } from '../types/keycloak';
import axios, { head } from 'axios'

export class KeycloakService {
  private client: any
  private client_token: string;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.KEYCLOAK_BASE_URL
    })
  }

  async getClientToken() {
    try {
      if (!this.client_token) {
        const { data } = await this.client.post(`/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
          new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.KEYCLOAK_CLIENT,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET
          })
        )
        this.client_token = data.access_token
      }
      return this.client_token
    } catch (error) {
      console.error(`Error to get client token ${error}`)
      throw error
    }
  }

  async addRole(role: string, userId: string) {
    try {
      const clientToken = await this.getClientToken()
      const { data: clientRoles } = await this.client.get(`/admin/realms/${process.env.KEYCLOAK_REALM}/clients/${process.env.KEYCLOAK_CLIENT_ID}/roles`, {
        headers: {
          Authorization: `Bearer ${clientToken}`
        }
      })

      const selectedRole = clientRoles.find((r: any) => r.name === role)

      if (!selectedRole) throw new Error(`Role not found`)

      await this.client.post(`/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}/role-mappings/clients/${process.env.KEYCLOAK_CLIENT_ID}`, [
        {
          "id": selectedRole.id,
          "name": selectedRole.name
        }
      ], {
        headers: {
          Authorization: `Bearer ${clientToken}`
        }
      })
    } catch (error) {
      console.error(`Error to add user role; ${error}`)
      throw new Error(`Error to add user role; ${error}`)
    }
  }

  async createUser(userData: CreateKeycloakUser, role: string) {
    try {
      const clientToken = await this.getClientToken()

      await this.client.post(`/admin/realms/${process.env.KEYCLOAK_REALM}/users`, userData, {
        headers: {
          Authorization: `Bearer ${clientToken}`
        }
      })
      const { data: createdUser } = await this.client.get(`/admin/realms/${process.env.KEYCLOAK_REALM}/users?username=${userData.username}`, {
        headers: {
          Authorization : `Bearer ${clientToken}`
        }
      })
      await this.addRole(role, createdUser[0].id)
    } catch (error) {
      console.error(`Error to create user ${error}`)
      throw new Error(`Error to create user ${error}`)
    }
  }
}