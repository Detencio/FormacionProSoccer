"""
Script para crear datos de ejemplo para el módulo de partidos
"""
import psycopg2
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

def create_matches_sample_data():
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/prosoccer_db')
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("📝 Creando datos de ejemplo para el módulo de partidos...")
        
        # Obtener IDs de usuarios y equipos existentes
        cursor.execute("SELECT id FROM users LIMIT 1;")
        user_id = cursor.fetchone()[0]
        
        cursor.execute("SELECT id FROM teams LIMIT 1;")
        team_id = cursor.fetchone()[0]
        
        cursor.execute("SELECT id FROM venues LIMIT 1;")
        venue_id = cursor.fetchone()[0]
        
        cursor.execute("SELECT id FROM external_teams LIMIT 1;")
        external_team_id = cursor.fetchone()[0]
        
        cursor.execute("SELECT id FROM championships LIMIT 1;")
        championship_id = cursor.fetchone()[0]
        
        # Crear partidos de ejemplo
        matches_data = [
            {
                'title': 'Matiz FC vs Los Tigres',
                'description': 'Partido amistoso contra equipo externo',
                'date': datetime.now() + timedelta(days=7),
                'venue_id': venue_id,
                'match_type': 'external_friendly',
                'home_team_id': team_id,
                'away_team_id': None,
                'external_team_id': external_team_id,
                'status': 'scheduled',
                'created_by': user_id
            },
            {
                'title': 'Entrenamiento Interno',
                'description': 'Partido de entrenamiento entre equipos internos',
                'date': datetime.now() + timedelta(days=3),
                'venue_id': venue_id,
                'match_type': 'internal_friendly',
                'home_team_id': None,
                'away_team_id': None,
                'status': 'scheduled',
                'created_by': user_id
            },
            {
                'title': 'Liga Local - Jornada 1',
                'description': 'Primera jornada del campeonato local',
                'date': datetime.now() + timedelta(days=14),
                'venue_id': venue_id,
                'match_type': 'championship',
                'home_team_id': team_id,
                'away_team_id': None,
                'championship_id': championship_id,
                'status': 'scheduled',
                'created_by': user_id
            }
        ]
        
        for match_data in matches_data:
            cursor.execute("""
                INSERT INTO matches (title, description, date, venue_id, match_type, 
                                   home_team_id, away_team_id, status, created_by)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (
                match_data['title'],
                match_data['description'],
                match_data['date'],
                match_data['venue_id'],
                match_data['match_type'],
                match_data['home_team_id'],
                match_data['away_team_id'],
                match_data['status'],
                match_data['created_by']
            ))
            
            match_id = cursor.fetchone()[0]
            print(f"✅ Partido creado: {match_data['title']} (ID: {match_id})")
            
            # Crear asistencia de ejemplo para algunos jugadores
            cursor.execute("SELECT id FROM players LIMIT 5;")
            player_ids = [row[0] for row in cursor.fetchall()]
            
            for i, player_id in enumerate(player_ids):
                status = 'confirmed' if i < 3 else 'pending'
                cursor.execute("""
                    INSERT INTO player_attendance (match_id, player_id, status)
                    VALUES (%s, %s, %s);
                """, (match_id, player_id, status))
            
            print(f"   - Asistencia creada para {len(player_ids)} jugadores")
        
        # Crear algunos eventos de partido de ejemplo
        cursor.execute("SELECT id FROM matches LIMIT 1;")
        match_id = cursor.fetchone()[0]
        
        cursor.execute("SELECT id FROM players LIMIT 3;")
        player_ids = [row[0] for row in cursor.fetchall()]
        
        events_data = [
            {'event_type': 'goal', 'minute': 15, 'team_side': 'home', 'player_id': player_ids[0]},
            {'event_type': 'assist', 'minute': 15, 'team_side': 'home', 'player_id': player_ids[1]},
            {'event_type': 'yellow_card', 'minute': 25, 'team_side': 'away', 'player_id': player_ids[2]},
            {'event_type': 'goal', 'minute': 45, 'team_side': 'away', 'player_id': player_ids[0]},
        ]
        
        for event_data in events_data:
            cursor.execute("""
                INSERT INTO match_events (match_id, player_id, event_type, minute, team_side)
                VALUES (%s, %s, %s, %s, %s);
            """, (
                match_id,
                event_data['player_id'],
                event_data['event_type'],
                event_data['minute'],
                event_data['team_side']
            ))
        
        print(f"✅ Eventos de partido creados: {len(events_data)} eventos")
        
        # Crear algunas notificaciones de ejemplo
        notifications_data = [
            {
                'type': 'match_invitation',
                'title': 'Invitación a Partido',
                'message': 'Has sido invitado al partido "Matiz FC vs Los Tigres"',
                'recipient_id': user_id,
                'match_id': match_id,
                'read': False
            },
            {
                'type': 'attendance_reminder',
                'title': 'Recordatorio de Asistencia',
                'message': 'No olvides confirmar tu asistencia al partido de mañana',
                'recipient_id': user_id,
                'match_id': match_id,
                'read': False
            }
        ]
        
        for notification_data in notifications_data:
            cursor.execute("""
                INSERT INTO notifications (type, title, message, recipient_id, match_id, read)
                VALUES (%s, %s, %s, %s, %s, %s);
            """, (
                notification_data['type'],
                notification_data['title'],
                notification_data['message'],
                notification_data['recipient_id'],
                notification_data['match_id'],
                notification_data['read']
            ))
        
        print(f"✅ Notificaciones creadas: {len(notifications_data)} notificaciones")
        
        conn.commit()
        print("\n🎉 Datos de ejemplo creados exitosamente!")
        print("\n📊 Resumen de datos creados:")
        print("   - 3 partidos de ejemplo")
        print("   - Asistencia para cada partido")
        print("   - 4 eventos de partido")
        print("   - 2 notificaciones de ejemplo")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    create_matches_sample_data() 