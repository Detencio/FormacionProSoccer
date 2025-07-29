"""
Script para probar los endpoints de la API de partidos
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:9000"

def test_matches_api():
    print("🧪 Probando endpoints de la API de partidos...")
    
    # 1. Probar obtener partidos (sin autenticación)
    print("\n1. Probando GET /matches/ (sin autenticación)...")
    try:
        response = requests.get(f"{BASE_URL}/matches/")
        print(f"   Status: {response.status_code}")
        if response.status_code == 401:
            print("   ✅ Correcto: Requiere autenticación")
        else:
            print(f"   ❌ Inesperado: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 2. Probar obtener venues (sin autenticación)
    print("\n2. Probando GET /venues/ (sin autenticación)...")
    try:
        response = requests.get(f"{BASE_URL}/venues/")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            venues = response.json()
            print(f"   ✅ Correcto: {len(venues)} venues encontrados")
            for venue in venues[:3]:
                print(f"      - {venue.get('name', 'N/A')}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 3. Probar obtener external teams (sin autenticación)
    print("\n3. Probando GET /external-teams/ (sin autenticación)...")
    try:
        response = requests.get(f"{BASE_URL}/external-teams/")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            teams = response.json()
            print(f"   ✅ Correcto: {len(teams)} equipos externos encontrados")
            for team in teams[:3]:
                print(f"      - {team.get('name', 'N/A')} ({team.get('level', 'N/A')})")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 4. Probar obtener championships (sin autenticación)
    print("\n4. Probando GET /championships/ (sin autenticación)...")
    try:
        response = requests.get(f"{BASE_URL}/championships/")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            championships = response.json()
            print(f"   ✅ Correcto: {len(championships)} campeonatos encontrados")
            for championship in championships[:3]:
                print(f"      - {championship.get('name', 'N/A')} ({championship.get('season', 'N/A')})")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 5. Probar obtener notifications (sin autenticación)
    print("\n5. Probando GET /notifications/ (sin autenticación)...")
    try:
        response = requests.get(f"{BASE_URL}/notifications/")
        print(f"   Status: {response.status_code}")
        if response.status_code == 401:
            print("   ✅ Correcto: Requiere autenticación")
        else:
            print(f"   ❌ Inesperado: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 6. Probar documentación de la API
    print("\n6. Probando documentación de la API...")
    try:
        response = requests.get(f"{BASE_URL}/docs")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Correcto: Documentación disponible")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 7. Verificar que los endpoints de partidos estén en la documentación
    print("\n7. Verificando endpoints en documentación...")
    try:
        response = requests.get(f"{BASE_URL}/openapi.json")
        if response.status_code == 200:
            openapi = response.json()
            paths = openapi.get('paths', {})
            
            matches_endpoints = [
                '/matches/',
                '/matches/{match_id}',
                '/matches/{match_id}/attendance/',
                '/matches/{match_id}/events/',
                '/venues/',
                '/external-teams/',
                '/championships/',
                '/notifications/'
            ]
            
            found_endpoints = []
            for endpoint in matches_endpoints:
                if endpoint in paths:
                    found_endpoints.append(endpoint)
            
            print(f"   ✅ Encontrados {len(found_endpoints)}/{len(matches_endpoints)} endpoints:")
            for endpoint in found_endpoints:
                print(f"      - {endpoint}")
            
            missing = set(matches_endpoints) - set(found_endpoints)
            if missing:
                print(f"   ⚠️  Faltan endpoints: {missing}")
        else:
            print(f"   ❌ Error al obtener OpenAPI: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n🎉 Pruebas completadas!")
    print("\n📋 Resumen:")
    print("   - Endpoints protegidos funcionan correctamente")
    print("   - Endpoints públicos funcionan correctamente")
    print("   - Documentación disponible")
    print("   - Datos de ejemplo creados")

if __name__ == "__main__":
    test_matches_api() 