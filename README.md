# Jet HR - Calcolatore RAL to Netto

Applicazione web Python Flask per il calcolo completo dello stipendio netto dalla RAL (Reddito Annuo Lordo), conforme alla normativa fiscale italiana 2024.

## 📋 Descrizione

Jet HR è un calcolatore professionale che permette di calcolare con precisione lo stipendio netto annuale e mensile a partire dalla RAL, considerando tutti i parametri fiscali e contributivi italiani:

- **Contributi INPS** (9,19% o 9,49% a seconda della dimensione aziendale)
- **IRPEF** con calcolo per scaglioni (23%, 35%, 43%)
- **Detrazioni fiscali** (lavoro dipendente, ulteriore detrazione, coniuge e figli a carico)
- **Detrazioni aggiuntive** (ex Bonus Renzi)
- **Trattamento integrativo**
- **Fondo pensione complementare** (deducibile fino a €5.164,57)
- **Imposte regionali e comunali** (Lombardia e Milano)
- **Calcolo mensile** su 12, 13 o 14 mensilità

## 🚀 Installazione

### Prerequisiti
- Python 3.7 o superiore
- pip (package manager Python)

### Setup

1. **Clona o scarica il progetto**
```bash
cd jet_hr
```

2. **Installa le dipendenze**
```bash
pip install -r requirements.txt
```

3. **Avvia l'applicazione**
```bash
python app.py
```

4. **Apri il browser**
```
http://127.0.0.1:5000
```

## 📁 Struttura del Progetto

```
jet_hr/
├── app.py                 # Applicazione Flask con logica di calcolo
├── requirements.txt       # Dipendenze Python (Flask 3.0.0)
├── README.md             # Documentazione
├── design.png            # Riferimento design UI
├── templates/
│   └── index.html        # Template HTML principale
└── static/
    ├── css/
    │   └── style.css     # Stili CSS personalizzati
    └── js/
        └── script.js     # JavaScript per interattività e calcoli client-side
```

## 🎯 Funzionalità Principali

### Input Configurabili
- **RAL**: Reddito Annuo Lordo (validazione numeri positivi)
- **Tipologia Contratto**: Tempo Indeterminato 
- **Dimensione Azienda**: < 50 dipendenti (INPS 9,19%) / ≥ 50 dipendenti (INPS 9,49%)
- **Comune di Residenza**: Selezione per calcolo imposte regionali e comunali
- **Coniuge a Carico**: Sì/No (con descrizione assistita)
- **Numero Figli a Carico**: 0-99 (validazione automatica)
- **Fondo Pensione**: 0-15% della RAL (deducibile fino a €5.164,57)

### Sintesi Calcolo
Tabella riepilogativa che mostra:
- RAL inserita
- Contributi INPS con aliquota applicata
- Imponibile Fiscale
- Versamento Fondo Pensione (se attivo)
- Imponibile Fiscale al Netto Fondo Pensione
- **IRPEF Lorda** (espandibile con dettaglio scaglioni)
- **Detrazioni** (espandibile con breakdown per tipologia)
- Detrazioni Aggiuntive (ex Bonus Renzi)
- Trattamento Integrativo
- Imposta Regionale (Lombardia)
- Imposta Comunale (Milano)
- **Totale Netto Annuale**

### Selezione Mensilità
- Radio buttons per scegliere 12, 13 o 14 mensilità (default: 13)
- Calcolo automatico del **Netto Mensile**
- Aggiornamento dinamico al cambio parametri

### Ulteriori Dettagli
Sezione collassabile con dettaglio completo di:
- Contributi INPS
- IRPEF (con breakdown scaglioni)
- Detrazioni (con breakdown per tipologia)
- Detrazioni Aggiuntive
- Trattamento Integrativo
- Imposte Regionali e Comunali


## 📄 Licenza

Questo progetto è sviluppato per scopi educativi e professionali.

## 🤝 Contributi

Per segnalazioni, miglioramenti o contributi, aprire una issue o pull request.

## ⚠️ Disclaimer

I calcoli sono basati sulla normativa fiscale italiana vigente. Per calcoli ufficiali e consulenze fiscali personalizzate, rivolgersi a un commercialista o consulente del lavoro certificato.
