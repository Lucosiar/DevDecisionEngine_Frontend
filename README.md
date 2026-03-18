# 🧠 Dev Decision Engine

## 🚀 Descripción general

Los desarrolladores no necesitan más código generado — necesitan saber qué hacer primero.

**Dev Decision Engine** es una herramienta web que transforma errores técnicos en decisiones claras y accionables para equipos de desarrollo.

En lugar de devolver explicaciones genéricas, el sistema analiza un error y proporciona:

* Causa raíz
* Impacto en el negocio
* Nivel de prioridad
* Solución recomendada
* Próxima acción sugerida

---

## 💡 Problema

El debugging sigue siendo caótico:

* Los errores no son claros
* La priorización es manual
* El impacto en negocio es desconocido
* Los equipos pierden tiempo decidiendo qué hacer

Las herramientas actuales de IA (Copilots, ChatGPT) generan texto o código, pero **no ayudan a tomar decisiones**.

---

## 🎯 Solución

Dev Decision Engine cambia el enfoque:

👉 De *“¿qué significa este error?”*
👉 A *“¿qué debería hacer ahora?”*

Convertimos problemas técnicos en decisiones estructuradas y priorizadas.

---

## ⚙️ Funcionalidades principales

* 🧾 Análisis automático de errores (stack traces, mensajes, etc.)
* 🧠 Identificación de causa probable
* 💥 Evaluación del impacto (usuario / negocio)
* ⚡ Priorización (crítica, media, baja)
* 🛠️ Propuesta de solución clara
* 📋 Generación automática de issue lista para usar

---

## 🧪 Cómo funciona

1. El usuario introduce un error o problema
2. El sistema analiza el contexto mediante IA
3. Se genera una salida estructurada con decisiones accionables

---

## 🌐 Demo

La aplicación permite probar el sistema directamente desde el navegador, introduciendo errores reales o utilizando ejemplos predefinidos.

---

## 🛠️ Stack tecnológico (propuesto)

* Frontend: Next.js + TailwindCSS
* Backend: API Routes
* IA: OpenAI / modelos LLM
* Despliegue: Vercel

---

## 🎯 Objetivo del proyecto

Reducir el tiempo de debugging y mejorar la toma de decisiones técnicas en equipos de desarrollo.

---

## 🧩 Estado

Proyecto desarrollado como prototipo funcional para hackathon, centrado en demostrar el valor del enfoque y la experiencia de usuario.

---

## 🚀 Diferenciación

No somos otro copiloto.

👉 Generamos decisiones, no solo respuestas.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
