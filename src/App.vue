<template>
  <CustomAlert
    :show="alertState.show"
    :title="alertState.title"
    :message="alertState.message"
    :type="alertState.type"
    @close="closeAlert"
  />
  <CustomConfirm
    :show="confirmState.show"
    :title="confirmState.title"
    :message="confirmState.message"
    @confirm="confirmAction"
    @cancel="cancelAction"
  />
  <router-view> </router-view>
</template>

<script setup>
import { RouterView } from 'vue-router'
import CustomAlert from './components/CustomAlert.vue'
import CustomConfirm from './components/CustomConfirm.vue'
import { useDialog } from './composables/useDialog'

// Usar el composable
const { alertState, confirmState, closeAlert, confirmAction, cancelAction } = useDialog()
</script>

<style>
/* ============================================
   VARIABLES CSS - TEMA RPG ÉPICO
   ============================================ */
:root {
  --bg-main: #1a0d2e;
  --bg-secondary: #2d1b4e;
  --panel-bg: #3d2563;
  --panel-hover: #4a2f7a;
  --primary: #b366ff;
  --primary-light: #d99fff;
  --primary-dark: #7d33cc;
  --accent-gold: #ffd700;
  --accent-cyan: #00ffff;
  --text-main: #f0e6ff;
  --text-secondary: #c9b8ff;
  --stroke: #1a1230;
  --stroke-light: #4a2f7a;
  --success: #00ff88;
  --healing: #66ff99;
  --damage: #ff4466;
  --stun: #ffaa00;
  --shadow: rgba(0, 0, 0, 0.6);

  --glow-strong: 0 0 40px rgba(179, 102, 255, 0.8);
  --glow-weak: 0 0 20px rgba(179, 102, 255, 0.4);
  --glow-gold: 0 0 30px rgba(255, 215, 0, 0.6);
  --glow-cyan: 0 0 30px rgba(0, 255, 255, 0.5);
  --glow-success: 0 0 30px rgba(0, 255, 136, 0.5);
  --glow-damage: 0 0 30px rgba(255, 68, 102, 0.5);
}

[data-theme='icefrost'] {
  --bg-main: #0f1f2e;
  --bg-secondary: #1a3a4a;
  --panel-bg: #1f4a63;
  --panel-hover: #2a5a78;
  --primary: #00d4ff;
  --primary-light: #66e6ff;
  --primary-dark: #0099cc;
  --accent-gold: #80d4ff;
  --accent-cyan: #00ffff;
  --text-main: #e0f7ff;
  --text-secondary: #a0d4e0;
  --stroke: #0a1a26;
  --stroke-light: #2a5a78;
  --success: #00ff88;
  --healing: #66ffaa;
  --damage: #ff6688;
  --stun: #ffbb33;
  --glow-strong: 0 0 40px rgba(0, 212, 255, 0.8);
  --glow-weak: 0 0 20px rgba(0, 212, 255, 0.4);
  --glow-gold: 0 0 30px rgba(128, 212, 255, 0.6);
}

[data-theme='blody'] {
  --bg-main: #1a0a0a;
  --bg-secondary: #3d1f1f;
  --panel-bg: #5c3333;
  --panel-hover: #704242;
  --primary: #ff4444;
  --primary-light: #ff7777;
  --primary-dark: #cc1111;
  --accent-gold: #ffaa33;
  --accent-cyan: #ff9900;
  --text-main: #ffe6e6;
  --text-secondary: #ffb3b3;
  --stroke: #0d0505;
  --stroke-light: #704242;
  --success: #ffcc00;
  --healing: #ffdd66;
  --damage: #ff3333;
  --stun: #ff6600;
  --glow-strong: 0 0 40px rgba(255, 68, 68, 0.8);
  --glow-weak: 0 0 20px rgba(255, 68, 68, 0.4);
  --glow-gold: 0 0 30px rgba(255, 170, 51, 0.6);
}

[data-theme='vindicator'] {
  --bg-main: #1a1d22;
  --bg-secondary: #2a3038;
  --panel-bg: #3a4452;
  --panel-hover: #4a5563;
  --primary: #7fb3d5;
  --primary-light: #a8c9e8;
  --primary-dark: #5a8ab8;
  --accent-gold: #d4af7a;
  --accent-cyan: #9ecae1;
  --text-main: #e6f2ff;
  --text-secondary: #b8d4e8;
  --stroke: #0f1215;
  --stroke-light: #4a5563;
  --success: #6dd999;
  --healing: #88ffaa;
  --damage: #ff7788;
  --stun: #ffcc44;
  --glow-strong: 0 0 40px rgba(127, 179, 213, 0.8);
  --glow-weak: 0 0 20px rgba(127, 179, 213, 0.4);
  --glow-gold: 0 0 30px rgba(212, 175, 122, 0.6);
}

/* ============================================
   RESET Y ESTILOS GLOBALES ÉPICOS
   ============================================ */
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Orbitron', 'Segoe UI', sans-serif;

  /* FONDO DE PANTALLA POR DEFECTO PARA MENÚS Y COMPONENTES */
  background-color: var(--bg-main);
  background-image:
    linear-gradient(rgba(26, 13, 46, 0.82), rgba(26, 13, 46, 0.88)), url('/world/default.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;

  color: var(--text-main);
  transition: background 0.3s ease;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Permite que las vistas de las páginas dejen traslucir el fondo global de body */
.page-shell {
  background: transparent !important;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(179, 102, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
  animation: pulse-bg 15s ease-in-out infinite;
}

@keyframes pulse-bg {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

/* ============================================
   ESTILOS DE LA PANTALLA DE CARGA
   ============================================ */
.loading-screen-rpg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, #1f113a 0%, #0d0519 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.loader-content {
  max-width: 550px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.loading-title {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  color: var(--accent-gold);
  margin: 25px 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
}
.loading-msg {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 30px;
  min-height: 48px;
  font-style: italic;
}
.loading-bar-container {
  width: 320px;
  height: 8px;
  background: #120720;
  border: 2px solid var(--primary-light);
  border-radius: 4px;
  overflow: hidden;
}
.loading-bar-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent-gold));
  animation: loading-shimmer 2s infinite linear;
  transform-origin: left;
}

@keyframes loading-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.fade-loading-leave-active {
  transition: opacity 0.6s ease;
}
.fade-loading-leave-to {
  opacity: 0;
}

/* ============================================
   COMPONENTES RPG COMPARTIDOS Y UTILIDADES
   ============================================ */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
::-webkit-scrollbar-track {
  background: linear-gradient(to bottom, var(--bg-main), var(--bg-secondary));
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, var(--primary-dark), var(--primary-light));
  border-radius: 6px;
  border: 2px solid var(--bg-main);
  box-shadow: var(--glow-weak);
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, var(--primary-light), var(--accent-gold));
  box-shadow: var(--glow-strong);
}

button {
  font-family: 'Orbitron', 'Cinzel', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  position: relative;
  overflow: hidden;
}
button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}
button:hover::before {
  left: 100%;
}

input,
textarea,
select {
  font-family: 'Orbitron', sans-serif;
  color: var(--text-main);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-main) 100%);
  border: 2px solid var(--stroke-light);
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 14px;
  transition: all 0.3s ease;
}
input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow:
    var(--glow-weak),
    inset 0 0 10px rgba(179, 102, 255, 0.2);
  transform: translateY(-2px);
}
input::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

h1 {
  font-family: 'Playfair Display', 'Cinzel', serif;
  font-size: 2.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0;
  background: linear-gradient(135deg, var(--primary-light), var(--accent-gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(179, 102, 255, 0.5);
  filter: drop-shadow(0 0 10px rgba(179, 102, 255, 0.3));
}
h2 {
  font-family: 'Cinzel', 'Orbitron', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--primary-light);
  text-shadow:
    0 2px 10px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(179, 102, 255, 0.3);
}
h3 {
  font-family: 'Cinzel', 'Orbitron', sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--primary);
  text-shadow: 0 0 15px rgba(179, 102, 255, 0.4);
}

@keyframes glow-pulse {
  0%,
  100% {
    text-shadow:
      0 0 10px var(--primary),
      0 0 20px var(--primary);
  }
  50% {
    text-shadow:
      0 0 20px var(--primary),
      0 0 40px var(--primary-light);
  }
}
@keyframes float-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes spin-glow {
  0% {
    box-shadow:
      0 0 20px var(--primary),
      0 0 40px var(--primary-dark);
    transform: rotate(0deg);
  }
  50% {
    box-shadow:
      0 0 40px var(--primary-light),
      0 0 60px var(--primary);
  }
  100% {
    box-shadow:
      0 0 20px var(--primary),
      0 0 40px var(--primary-dark);
    transform: rotate(0deg);
  }
}

.animate-float {
  animation: float-up 0.5s ease-out;
}
.animate-glow {
  animation: glow-pulse 2s ease-in-out infinite;
}
.animate-spin-glow {
  animation: spin-glow 3s ease-in-out infinite;
}

.btn-rpg {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--text-main);
  border: 2px solid var(--primary-light);
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow:
    var(--glow-weak),
    0 5px 15px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}
.btn-rpg:hover {
  transform: translateY(-3px);
  box-shadow:
    var(--glow-strong),
    0 10px 25px rgba(0, 0, 0, 0.6);
  border-color: var(--accent-gold);
}
.btn-rpg.primary {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
}
.btn-rpg.secondary {
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-cyan) 100%);
  border-color: var(--accent-cyan);
  color: var(--bg-main);
}
.btn-rpg.danger {
  background: linear-gradient(135deg, var(--damage) 0%, #cc2244 100%);
  border-color: var(--damage);
}
.btn-rpg.success {
  background: linear-gradient(135deg, var(--success) 0%, var(--healing) 100%);
  border-color: var(--success);
  color: var(--bg-main);
}

.panel-epic {
  background: linear-gradient(135deg, var(--panel-bg) 0%, var(--panel-hover) 100%);
  border: 2px solid var(--primary-light);
  border-radius: 8px;
  padding: 20px;
  box-shadow:
    0 0 30px rgba(179, 102, 255, 0.3),
    inset 0 0 20px rgba(179, 102, 255, 0.1),
    0 10px 30px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}
.panel-epic::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-light), transparent);
  animation: shimmer 2s ease-in-out infinite;
}
.card-epic {
  background: linear-gradient(135deg, rgba(61, 37, 99, 0.8) 0%, rgba(74, 47, 122, 0.8) 100%);
  border: 2px solid var(--primary-light);
  border-radius: 8px;
  padding: 16px;
  box-shadow:
    0 0 20px rgba(179, 102, 255, 0.4),
    0 8px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}
.card-epic:hover {
  transform: translateY(-5px);
  box-shadow:
    0 0 40px rgba(179, 102, 255, 0.6),
    0 15px 30px rgba(0, 0, 0, 0.6);
  border-color: var(--accent-gold);
}

.badge-epic {
  display: inline-block;
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
  color: var(--text-main);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--primary-light);
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 0 15px rgba(179, 102, 255, 0.4);
  transition: all 0.3s ease;
}
.badge-epic.success {
  background: linear-gradient(135deg, var(--healing) 0%, var(--success) 100%);
  border-color: var(--success);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
}
.badge-epic.damage {
  background: linear-gradient(135deg, #cc2244 0%, var(--damage) 100%);
  border-color: var(--damage);
  box-shadow: 0 0 15px rgba(255, 68, 102, 0.4);
}
.badge-epic.gold {
  background: linear-gradient(135deg, #cc8800 0%, var(--accent-gold) 100%);
  border-color: var(--accent-gold);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  color: var(--bg-main);
}
</style>
