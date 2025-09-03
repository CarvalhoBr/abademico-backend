import { CreateKeycloakUser } from '@/types/keycloak';
import axios from 'axios';

export class KeycloakService {
  private readonly instance: any;
  
  constructor(){
    this.instance = axios.create({
      baseURL: process.env.KEYCLOAK_BASE_URL!
    })
  }

  async getClientToken(): Promise<string>{
    try {
      const { data } = await this.instance.post(`/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: process.env.KEYCLOAK_CLIENT!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          grant_type: 'client_credentials',
        })
      )
      return data.access_token
    } catch (error) {
      console.error(`Error to get access token ${JSON.stringify(error)}`)
      throw new Error('Falha na comunicação com o servidor de autenticação')  
    }
  }

  async findByUsername(username: string){
    try {
      const access_token = await this.getClientToken()
      const { data } = await this.instance.get(`/admin/realms/${process.env.KEYCLOAK_REALM}/users?username=${username}`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      if (!data[0]){
        throw new Error(`Usuário não encontrado`)
      }
      return data[0]
    } catch (error: any) {
      console.error(`Erro ao buscar usuário ${JSON.stringify(error)}`)
      if (error?.message === `Usuário não encontrado`) throw error
      throw new Error(`Erro ao buscar usuário`)
    }
  }

  async addRole(userId: string, role: string) {
    try {
      const access_token = await this.getClientToken()
      const { data } = await this.instance.get(`/admin/realms/${process.env.KEYCLOAK_REALM}/clients/${process.env.KEYCLOAK_CLIENT_ID}/roles`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      const clientRole = data.find((r: any) => r.name === role)
      if (!clientRole) throw new Error(`Role não encontrada`)

      await this.instance.post(`/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}/role-mappings/clients/${process.env.KEYCLOAK_CLIENT_ID}`, {
        id: clientRole.id,
        name: clientRole.name
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
    } catch (error) {
      
    }
  }

  async createUser(data: CreateKeycloakUser, role: string){
    try {
      const access_token = await this.getClientToken()
      await this.instance.post(`/admin/realms/${process.env.KEYCLOAK_REALM}/users`, data, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      const createdUser = await this.findByUsername(data.username)
      await this.addRole(createdUser.id, role)
      return createdUser
    } catch (error) {
      console.error(`Error to create user ${error}`)
      throw new Error(`Error to create user ${error}`)
    }
  }


}