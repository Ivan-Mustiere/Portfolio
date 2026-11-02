#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

print_header() {
  echo ""
  echo -e "${CYAN}${BOLD}╔═════════════════════════════════╗${RESET}"
  echo -e "${CYAN}${BOLD}║  Portfolio — ivan-mustiere.com  ║${RESET}"
  echo -e "${CYAN}${BOLD}╚═════════════════════════════════╝${RESET}"
  echo ""
}

print_menu() {
  echo -e "${BOLD}Que voulez-vous faire ?${RESET}"
  echo ""
  echo -e "  ${GREEN}1)${RESET} Démarrer                (docker compose up -d)"
  echo -e "  ${RED}2)${RESET} Arrêter                 (docker compose down)"
  echo -e "  ${YELLOW}3)${RESET} Rebuilder et relancer   (docker compose up -d --build)"
  echo -e "  ${CYAN}4)${RESET} Voir les logs            (docker compose logs -f)"
  echo -e "  ${BOLD}5)${RESET} Statut des conteneurs   (docker compose ps)"
  echo -e "  ${RED}6)${RESET} Nettoyer tout            (down + volumes + images orphelines)"
  echo -e "  ${BOLD}0)${RESET} Quitter"
  echo ""
}

check_env() {
  if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠  Fichier .env introuvable.${RESET}"
    if [ -f .env.example ]; then
      echo -e "   Copie de .env.example → .env"
      cp .env.example .env
      echo -e "${YELLOW}   Pensez à remplir DOCKER_BACKEND_SECRET dans .env${RESET}"
    fi
  fi
}

cmd_start() {
  check_env
  echo -e "${GREEN}▶  Démarrage des services...${RESET}"
  docker compose up -d
  echo -e "${GREEN}✓  Frontend : http://localhost:3002${RESET}"
  echo -e "${GREEN}✓  Backend  : interne (non exposé)${RESET}"
}

cmd_stop() {
  echo -e "${RED}■  Arrêt des services...${RESET}"
  docker compose down
  echo -e "${RED}✓  Services arrêtés.${RESET}"
}

cmd_rebuild() {
  check_env
  echo -e "${YELLOW}⟳  Rebuild et redémarrage...${RESET}"
  docker compose up -d --build
  echo -e "${GREEN}✓  Frontend : http://localhost:3002${RESET}"
  echo -e "${GREEN}✓  Backend  : interne (non exposé)${RESET}"
}

cmd_logs() {
  echo -e "${CYAN}📋 Logs en direct (Ctrl+C pour quitter)...${RESET}"
  docker compose logs -f
}

cmd_status() {
  echo -e "${BOLD}📊 Statut des conteneurs :${RESET}"
  docker compose ps
}

cmd_clean() {
  echo -e "${RED}⚠  Suppression des conteneurs, volumes et images orphelines...${RESET}"
  read -p "   Confirmer ? (o/N) " confirm
  if [[ "$confirm" =~ ^[oOyY]$ ]]; then
    docker compose down -v --remove-orphans
    docker image prune -f
    echo -e "${RED}✓  Nettoyage terminé.${RESET}"
  else
    echo "   Annulé."
  fi
}

# --- Point d'entrée ---

print_header

# Argument direct (ex: ./run.sh 1)
if [ -n "$1" ]; then
  case "$1" in
    1) cmd_start ;;
    2) cmd_stop ;;
    3) cmd_rebuild ;;
    4) cmd_logs ;;
    5) cmd_status ;;
    6) cmd_clean ;;
    *) echo -e "${RED}Option invalide : $1${RESET}" ; exit 1 ;;
  esac
  exit 0
fi

# Menu interactif
print_menu
read -p "Choix [0-6] : " choice

case "$choice" in
  1) cmd_start ;;
  2) cmd_stop ;;
  3) cmd_rebuild ;;
  4) cmd_logs ;;
  5) cmd_status ;;
  6) cmd_clean ;;
  0) echo "Au revoir." ; exit 0 ;;
  *) echo -e "${RED}Option invalide.${RESET}" ; exit 1 ;;
esac
