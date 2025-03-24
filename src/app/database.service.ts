import { Injectable, Inject, Optional } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Platform } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection | null = null;
  private db!: SQLiteDBConnection;
  private initialized = false;
  private readonly DB_NAME = 'mifinanza_db';

  constructor(
    private platform: Platform,
    @Optional() @Inject('SQLITE') private sqliteProvider: any
  ) {
    this.initializePlugin();
  }

  private async initializePlugin() {
    try {
      if (Capacitor.getPlatform() === 'web') {
        await this.platform.ready();
        if (this.sqliteProvider) {
          this.sqlite = new SQLiteConnection(this.sqliteProvider);
        }
      } else {
        this.sqlite = new SQLiteConnection(CapacitorSQLite);
      }
      await this.initializeDatabase();
    } catch (error) {
      console.error('Error al inicializar SQLite:', error);
    }
  }

  private async initializeDatabase() {
    if (this.initialized || !this.sqlite) {
      return;
    }

    try {
      // Crear o abrir la base de datos
      const db = await this.sqlite.createConnection(
        this.DB_NAME,
        false,
        'no-encryption',
        1,
        false
      );

      await db.open();

      // Crear tabla de usuarios si no existe
      const query = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await db.execute(query);
      this.db = db;
      this.initialized = true;
      console.log('Base de datos inicializada correctamente');

    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  // ... resto de los métodos ...


  async getAllUsers(): Promise<any[]> {
    try {
      await this.initializeDatabase();
      
      const query = `
        SELECT username, name, created_at 
        FROM users;
      `;
      
      const result = await this.db.query(query);
      return result.values || [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  async deleteUser(username: string): Promise<boolean> {
    try {
      await this.initializeDatabase();
      
      const query = `
        DELETE FROM users 
        WHERE username = ?;
      `;
      
      await this.db.run(query, [username]);
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return false;
    }
  }
  async addUser(username: string, password: string, name: string): Promise<boolean> {
    try {
      await this.initializeDatabase();
      
      const query = `
        INSERT INTO users (username, password, name) 
        VALUES (?, ?, ?);
      `;
      
      await this.db.run(query, [username, password, name]);
      return true;
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      return false;
    }
  }
  

}