import axios from 'axios'

export class KeycloakService {
  private client: any

  constructor(){
    this.client = axios.create({
      baseURL: process.env.KEYCLOAK_BASE_URL
    })
  }

  async getClientToken() {
    try {
      const { data } = await this.client.post(`/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.KEYCLOAK_CLIENT,
          client_secret: process.env.KEYCLOAK_SECRET
        })
      )
    } catch (error) {
      
    }
  }
}