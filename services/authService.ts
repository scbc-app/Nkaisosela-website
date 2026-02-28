
import { UserAccount } from "../types";

export class AuthService {
  private static STORAGE_KEY = 'nkaisosela_auth_user';

  static async login(email: string, pass: string, users: UserAccount[]): Promise<UserAccount | null> {
    if (!email || !pass) return null;

    const user = users.find(u => 
      String(u.Email).toLowerCase().trim() === email.toLowerCase().trim() && 
      String(u.Password).trim() === String(pass).trim()
    );
    
    if (user) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ ...user, loginTime: new Date().toISOString() }));
      return user;
    }
    
    return null;
  }

  static logout() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static getStoredUser(): UserAccount | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static isAdmin(): boolean {
    const user = this.getStoredUser();
    return String(user?.Role).toLowerCase() === 'admin';
  }
}
