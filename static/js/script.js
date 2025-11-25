// RAL Input Validation and Calculate Button Logic
document.addEventListener('DOMContentLoaded', function() {
    const ralInput = document.getElementById('ralInput');
    const ralError = document.getElementById('ralError');
    const calculateBtn = document.getElementById('calculateBtn');
    const companySizeSelect = document.getElementById('companySize');
    const resultsSection = document.getElementById('resultsSection');
    const contributiValue = document.getElementById('contributiValue');
    const imponibileValue = document.getElementById('imponibileValue');
    const imponibileNettoFondoItem = document.getElementById('imponibileNettoFondoItem');
    const imponibileNettoFondoValue = document.getElementById('imponibileNettoFondoValue');
    
    // Elementi IRPEF
    const irpefSection = document.getElementById('irpefSection');
    const irpefTotaleValue = document.getElementById('irpefTotaleValue');
    const scaglione1Value = document.getElementById('scaglione1Value');
    const scaglione2Value = document.getElementById('scaglione2Value');
    const scaglione3Value = document.getElementById('scaglione3Value');
    const irpefToggle = document.getElementById('irpefToggle');
    const irpefBreakdown = document.getElementById('irpefBreakdown');
    
    // Elementi Detrazioni (Aggregate)
    const detrazioniSection = document.getElementById('detrazioniSection');
    const detrazioniTotaleValue = document.getElementById('detrazioniTotaleValue');
    const detrazioniValue = document.getElementById('detrazioniValue');
    const ulterioreDetrazioneValue = document.getElementById('ulterioreDetrazioneValue');
    const detrazioniConiugeValue = document.getElementById('detrazioniConiugeValue');
    const detrazioniFigliValue = document.getElementById('detrazioniFigliValue');
    const detrazioniToggle = document.getElementById('detrazioniToggle');
    const detrazioniBreakdown = document.getElementById('detrazioniBreakdown');
    
    // Elementi Detrazione Aggiuntiva
    const detrazioneAggiuntiveSection = document.getElementById('detrazioneAggiuntiveSection');
    const detrazioneAggiuntiveValue = document.getElementById('detrazioneAggiuntiveValue');
    
    // Elementi Trattamento Integrativo
    const trattamentoIntegrativoSection = document.getElementById('trattamentoIntegrativoSection');
    const trattamentoIntegrativoValue = document.getElementById('trattamentoIntegrativoValue');
    
    // Elementi Imposta Regionale
    const impostaRegionaleSection = document.getElementById('impostaRegionaleSection');
    const impostaRegionaleValue = document.getElementById('impostaRegionaleValue');
    
    // Elementi Imposta Comunale
    const impostaComunaleSection = document.getElementById('impostaComunaleSection');
    const impostaComunaleValue = document.getElementById('impostaComunaleValue');
    
    // Elementi Toggle Coniuge e Figli
    const coniugeCaricoToggle = document.getElementById('coniugeCarico');
    const coniugeCaricoLabel = document.getElementById('coniugeCaricoLabel');
    const figliCaricoInput = document.getElementById('figliCarico');
    const fondoPensioneInput = document.getElementById('fondoPensione');
    const fondoPensioneError = document.getElementById('fondoPensioneError');
    
    // Elementi Sintesi
    const sintesiSection = document.getElementById('sintesiSection');
    const sintesiRAL = document.getElementById('sintesiRAL');
    const sintesiAliquota = document.getElementById('sintesiAliquota');
    const sintesiContributi = document.getElementById('sintesiContributi');
    const sintesiImponibile = document.getElementById('sintesiImponibile');
    const sintesiFondoRow = document.getElementById('sintesiFondoRow');
    const sintesiPercentualeFondo = document.getElementById('sintesiPercentualeFondo');
    const sintesiFondo = document.getElementById('sintesiFondo');
    const sintesiImponibileNettoRow = document.getElementById('sintesiImponibileNettoRow');
    const sintesiImponibileNetto = document.getElementById('sintesiImponibileNetto');
    const sintesiIrpefToggle = document.getElementById('sintesiIrpefToggle');
    const sintesiIrpef = document.getElementById('sintesiIrpef');
    const sintesiIrpefBreakdown = document.getElementById('sintesiIrpefBreakdown');
    const sintesiScaglione1 = document.getElementById('sintesiScaglione1');
    const sintesiScaglione2 = document.getElementById('sintesiScaglione2');
    const sintesiScaglione3 = document.getElementById('sintesiScaglione3');
    const sintesiDetrazioniToggle = document.getElementById('sintesiDetrazioniToggle');
    const sintesiDetrazioni = document.getElementById('sintesiDetrazioni');
    const sintesiDetrazioniBreakdown = document.getElementById('sintesiDetrazioniBreakdown');
    const sintesiDetrazioniLavoro = document.getElementById('sintesiDetrazioniLavoro');
    const sintesiUlterioreDetrazione = document.getElementById('sintesiUlterioreDetrazione');
    const sintesiDetrazioniConiuge = document.getElementById('sintesiDetrazioniConiuge');
    const sintesiDetrazioniFigli = document.getElementById('sintesiDetrazioniFigli');
    const sintesiDetrazioniAggiuntive = document.getElementById('sintesiDetrazioniAggiuntive');
    const sintesiTrattamento = document.getElementById('sintesiTrattamento');
    const sintesiImpostaRegionale = document.getElementById('sintesiImpostaRegionale');
    const sintesiImpostaComunale = document.getElementById('sintesiImpostaComunale');
    const sintesiTotaleNetto = document.getElementById('sintesiTotaleNetto');
    
    // Elementi Ulteriori Dettagli
    const ulterioriDettagliSection = document.getElementById('ulterioriDettagliSection');
    const ulterioriDettagliToggle = document.getElementById('ulterioriDettagliToggle');
    const ulterioriDettagliContent = document.getElementById('ulterioriDettagliContent');
    
    // Elementi Mensilità
    const mensilitaRadios = document.querySelectorAll('input[name="mensilita"]');
    const nettoMensileSection = document.getElementById('nettoMensileSection');
    const sintesiNettoMensile = document.getElementById('sintesiNettoMensile');
    const mensileScelteLabel = document.getElementById('mensileScelteLabel');
    
    let isRALValid = false;
    let currentTotaleNetto = 0;
    
    // Formatta il numero con separatore migliaia
    function formatNumberWithThousands(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    
    // Rimuove la formattazione e restituisce solo numeri
    function unformatNumber(str) {
        return str.replace(/\./g, '');
    }
    
    if (ralInput) {
        // Permetti solo numeri durante la digitazione
        ralInput.addEventListener('input', function(e) {
            let value = e.target.value;
            
            // Rimuovi tutti i caratteri non numerici e i punti
            const numericValue = value.replace(/[^0-9]/g, '');
            
            // Formatta con separatore migliaia
            const formattedValue = numericValue ? formatNumberWithThousands(numericValue) : '';
            
            // Aggiorna il valore dell'input con la formattazione
            e.target.value = formattedValue;
            
            // Valida l'input e aggiorna lo stato del bottone
            isRALValid = validateRALInput(numericValue);
            updateCalculateButton();
        });
        
        // Validazione al blur (quando l'utente esce dal campo)
        ralInput.addEventListener('blur', function(e) {
            const numericValue = unformatNumber(e.target.value);
            isRALValid = validateRALInput(numericValue);
            updateCalculateButton();
        });
        
        // Previeni incolla di caratteri non numerici
        ralInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numericValue = pastedText.replace(/[^0-9]/g, '');
            
            // Formatta con separatore migliaia
            e.target.value = numericValue ? formatNumberWithThousands(numericValue) : '';
            
            // Valida il nuovo valore
            isRALValid = validateRALInput(numericValue);
            updateCalculateButton();
        });
        
        // Previeni digitazione di caratteri speciali con la tastiera
        ralInput.addEventListener('keypress', function(e) {
            const charCode = e.which ? e.which : e.keyCode;
            
            // Permetti solo numeri (0-9)
            if (charCode < 48 || charCode > 57) {
                e.preventDefault();
                return false;
            }
        });
    }
    
    // Funzione di validazione
    function validateRALInput(value) {
        // Reset errore
        ralError.textContent = '';
        ralInput.classList.remove('error');
        
        // Se il campo è vuoto, non mostrare errore
        if (value === '') {
            return false;
        }
        
        // Converti in numero
        const numValue = parseInt(value, 10);
        
        // Verifica che sia un numero valido
        if (isNaN(numValue)) {
            showError('Inserisci un valore numerico valido');
            return false;
        }
        
        // Verifica che sia strettamente positivo (maggiore di 0)
        if (numValue <= 0) {
            showError('La RAL deve essere un valore positivo');
            return false;
        }
        
        // Verifica che non sia troppo grande (limite ragionevole)
        if (numValue > 10000000) {
            showError('Il valore inserito è troppo elevato');
            return false;
        }
        
        // Validazione superata
        return true;
    }
    
    // Mostra errore
    function showError(message) {
        ralError.textContent = message;
        ralInput.classList.add('error');
    }
    
    // Aggiorna lo stato del bottone Calcola
    function updateCalculateButton() {
        if (calculateBtn) {
            calculateBtn.disabled = !isRALValid;
        }
    }
    
    // Formatta numeri in Euro
    function formatEuro(value) {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }
    
    // Toggle handler for Coniuge a Carico
    coniugeCaricoToggle.addEventListener('change', function() {
        coniugeCaricoLabel.textContent = this.checked ? 'Sì' : 'No';
    });
    
    // Validate Figli a Carico input
    figliCaricoInput.addEventListener('input', function() {
        let value = parseInt(this.value);
        if (value < 0 || isNaN(value)) {
            this.value = 0;
        }
        // Ensure integer values only
        this.value = Math.floor(Math.abs(this.value || 0));
    });
    
    // Validate Fondo Pensione input
    fondoPensioneInput.addEventListener('input', function() {
        let value = parseFloat(this.value);
        fondoPensioneError.textContent = '';
        
        if (isNaN(value)) {
            this.value = 0;
            return;
        }
        
        if (value < 0) {
            this.value = 0;
            fondoPensioneError.textContent = 'Il valore deve essere positivo';
        } else if (value > 15) {
            this.value = 15;
            fondoPensioneError.textContent = 'Il valore massimo è 15%';
        }
    });
    
    // Handle mensilità selection
    mensilitaRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked && currentTotaleNetto > 0) {
                const mensilita = parseInt(this.value);
                const nettoMensile = currentTotaleNetto / mensilita;
                
                sintesiNettoMensile.textContent = formatEuro(nettoMensile);
                mensileScelteLabel.textContent = mensilita;
                nettoMensileSection.classList.remove('hidden');
            }
        });
    });
    
    // Calcola e mostra i contributi INPS
    async function calculateINPS() {
        // Rimuovi la formattazione prima di inviare al backend
        const numericValue = unformatNumber(ralInput.value);
        const ral = parseInt(numericValue, 10);
        const aziendaGrande = companySizeSelect.value;
        const numeroFigli = parseInt(figliCaricoInput.value) || 0;
        const coniugeACarico = coniugeCaricoToggle.checked;
        const percentualeFondoPensione = parseFloat(fondoPensioneInput.value) || 0;
        
        // Aggiorna la label con l'aliquota corretta
        updateContributiLabel(aziendaGrande);
        
        try {
            const response = await fetch('/calcola_inps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ral: ral,
                    azienda_grande: aziendaGrande,
                    numero_figli: numeroFigli,
                    coniuge_a_carico: coniugeACarico,
                    percentuale_fondo_pensione: percentualeFondoPensione
                })
            });
            
            if (!response.ok) {
                throw new Error('Errore nel calcolo');
            }
            
            const data = await response.json();
            
            // Aggiorna tabella di sintesi
            sintesiRAL.textContent = formatEuro(ral);
            const aliquotaText = aziendaGrande === 'true' ? '9,49%' : '9,19%';
            sintesiAliquota.textContent = aliquotaText;
            sintesiContributi.textContent = '- ' + formatEuro(data.contributi_inps);
            sintesiImponibile.textContent = formatEuro(data.imponibile_fiscale);
            
            // Mostra/nascondi righe fondo pensione
            if (percentualeFondoPensione > 0) {
                sintesiPercentualeFondo.textContent = percentualeFondoPensione + '%';
                sintesiFondo.textContent = '- ' + formatEuro(data.versamento_fondo_pensione);
                sintesiImponibileNetto.textContent = formatEuro(data.imponibile_netto_fondo);
                sintesiFondoRow.style.display = 'table-row';
                sintesiImponibileNettoRow.style.display = 'table-row';
            } else {
                sintesiFondoRow.style.display = 'none';
                sintesiImponibileNettoRow.style.display = 'none';
            }
            
            // Aggiorna IRPEF nella sintesi
            sintesiIrpef.textContent = '- ' + formatEuro(data.irpef_totale);
            sintesiScaglione1.textContent = '- ' + formatEuro(data.irpef_scaglione_1);
            sintesiScaglione2.textContent = '- ' + formatEuro(data.irpef_scaglione_2);
            sintesiScaglione3.textContent = '- ' + formatEuro(data.irpef_scaglione_3);
            
            // Aggiorna detrazioni nella sintesi
            const totaleDetrazioni = data.detrazioni_lavoro_dipendente + 
                                    data.ulteriore_detrazione + 
                                    data.detrazioni_coniuge_a_carico + 
                                    data.detrazioni_figli_a_carico;
            sintesiDetrazioni.textContent = formatEuro(totaleDetrazioni);
            sintesiDetrazioniLavoro.textContent = formatEuro(data.detrazioni_lavoro_dipendente);
            sintesiUlterioreDetrazione.textContent = formatEuro(data.ulteriore_detrazione);
            sintesiDetrazioniConiuge.textContent = formatEuro(data.detrazioni_coniuge_a_carico);
            sintesiDetrazioniFigli.textContent = formatEuro(data.detrazioni_figli_a_carico);
            
            // Aggiorna altri valori nella sintesi
            sintesiDetrazioniAggiuntive.textContent = formatEuro(data.detrazione_aggiuntive);
            sintesiTrattamento.textContent = formatEuro(data.trattamento_integrativo);
            sintesiImpostaRegionale.textContent = '- ' + formatEuro(data.imposta_regionale);
            sintesiImpostaComunale.textContent = '- ' + formatEuro(data.imposta_comunale);
            
            // Calcola totale netto
            const totaleNetto = ral - data.contributi_inps - 
                              (percentualeFondoPensione > 0 ? data.versamento_fondo_pensione : 0) -
                              data.irpef_totale + totaleDetrazioni + 
                              data.detrazione_aggiuntive + data.trattamento_integrativo -
                              data.imposta_regionale - data.imposta_comunale;
            sintesiTotaleNetto.textContent = formatEuro(totaleNetto);
            currentTotaleNetto = totaleNetto;
            
            // Update netto mensile if a mensilità is already selected
            const selectedMensilita = document.querySelector('input[name="mensilita"]:checked');
            if (selectedMensilita) {
                const mensilita = parseInt(selectedMensilita.value);
                const nettoMensile = totaleNetto / mensilita;
                sintesiNettoMensile.textContent = formatEuro(nettoMensile);
                mensileScelteLabel.textContent = mensilita;
                nettoMensileSection.classList.remove('hidden');
            }
            
            // Aggiorna i valori INPS
            contributiValue.textContent = formatEuro(data.contributi_inps);
            imponibileValue.textContent = formatEuro(data.imponibile_fiscale);
            
            // Mostra/nascondi l'imponibile netto fondo pensione
            if (percentualeFondoPensione > 0) {
                imponibileNettoFondoValue.textContent = formatEuro(data.imponibile_netto_fondo);
                imponibileNettoFondoItem.style.display = 'flex';
            } else {
                imponibileNettoFondoItem.style.display = 'none';
            }
            
            // Aggiorna i valori IRPEF
            irpefTotaleValue.textContent = formatEuro(data.irpef_totale);
            scaglione1Value.textContent = formatEuro(data.irpef_scaglione_1);
            scaglione2Value.textContent = formatEuro(data.irpef_scaglione_2);
            scaglione3Value.textContent = formatEuro(data.irpef_scaglione_3);
            
            // Aggiorna le detrazioni lavoro dipendente
            detrazioniValue.textContent = formatEuro(data.detrazioni_lavoro_dipendente);
            
            // Aggiorna ulteriore detrazione
            ulterioreDetrazioneValue.textContent = formatEuro(data.ulteriore_detrazione);
            
            // Aggiorna detrazioni coniuge a carico
            detrazioniConiugeValue.textContent = formatEuro(data.detrazioni_coniuge_a_carico);
            
            // Aggiorna detrazioni figli a carico
            detrazioniFigliValue.textContent = formatEuro(data.detrazioni_figli_a_carico);
            
            // Calcola il totale delle detrazioni aggregate per la sezione detrazioni
            const totaleDetrazioniSezione = data.detrazioni_lavoro_dipendente + 
                                    data.ulteriore_detrazione + 
                                    data.detrazioni_coniuge_a_carico + 
                                    data.detrazioni_figli_a_carico;
            detrazioniTotaleValue.textContent = formatEuro(totaleDetrazioniSezione);
            
            // Aggiorna detrazione aggiuntive
            detrazioneAggiuntiveValue.textContent = formatEuro(data.detrazione_aggiuntive);
            
            // Aggiorna trattamento integrativo
            trattamentoIntegrativoValue.textContent = formatEuro(data.trattamento_integrativo);
            
            // Aggiorna imposta regionale
            impostaRegionaleValue.textContent = formatEuro(data.imposta_regionale);
            
            // Aggiorna imposta comunale
            impostaComunaleValue.textContent = formatEuro(data.imposta_comunale);
            
            // Mostra le sezioni risultati
            sintesiSection.classList.remove('hidden');
            ulterioriDettagliSection.classList.remove('hidden');
            
            // Scroll alla sezione sintesi
            sintesiSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
        } catch (error) {
            console.error('Errore:', error);
            alert('Errore nel calcolo dei contributi INPS');
        }
    }
    
    // Aggiorna la label dei contributi INPS con l'aliquota
    function updateContributiLabel(aziendaGrande) {
        const contributiLabel = document.getElementById('contributiLabel');
        const aliquota = aziendaGrande === 'true' ? '9,49%' : '9,19%';
        contributiLabel.textContent = `Contributi INPS (${aliquota}):`;
    }
    
    // Event listener per il bottone Calcola
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            if (isRALValid) {
                calculateINPS();
            }
        });
    }
    
    // Event listener per il cambio di dimensione azienda
    if (companySizeSelect) {
        companySizeSelect.addEventListener('change', function() {
            // Se i risultati sono già visibili, ricalcola automaticamente
            if (!resultsSection.classList.contains('hidden')) {
                calculateINPS();
            }
        });
    }
    
    // Toggle IRPEF breakdown
    if (irpefToggle) {
        irpefToggle.addEventListener('click', function() {
            irpefBreakdown.classList.toggle('hidden');
            this.classList.toggle('active');
            
            // Aggiorna il testo del bottone
            const text = this.querySelector('span');
            if (irpefBreakdown.classList.contains('hidden')) {
                text.textContent = 'Mostra dettagli scaglioni';
            } else {
                text.textContent = 'Nascondi dettagli scaglioni';
            }
        });
    }
    
    // Toggle per Ulteriori Dettagli
    if (ulterioriDettagliToggle && ulterioriDettagliContent) {
        ulterioriDettagliToggle.addEventListener('click', function() {
            ulterioriDettagliContent.classList.toggle('hidden');
            this.classList.toggle('active');
            
            // Aggiorna il testo del bottone
            const text = this.querySelector('span');
            if (ulterioriDettagliContent.classList.contains('hidden')) {
                text.textContent = 'Ulteriori Dettagli';
            } else {
                text.textContent = 'Nascondi Ulteriori Dettagli';
            }
        });
    }
    
    // Toggle per i dettagli delle detrazioni
    if (detrazioniToggle) {
        detrazioniToggle.addEventListener('click', function() {
            detrazioniBreakdown.classList.toggle('hidden');
            this.classList.toggle('active');
            
            // Aggiorna il testo del bottone
            const text = this.querySelector('span');
            if (detrazioniBreakdown.classList.contains('hidden')) {
                text.textContent = 'Mostra dettagli detrazioni';
            } else {
                text.textContent = 'Nascondi dettagli detrazioni';
            }
        });
    }
    
    // Toggle per IRPEF nella sintesi
    if (sintesiIrpefToggle) {
        // Imposta come attivo di default
        sintesiIrpefToggle.classList.add('active');
        
        sintesiIrpefToggle.addEventListener('click', function() {
            sintesiIrpefBreakdown.classList.toggle('hidden');
            this.classList.toggle('active');
        });
    }
    
    // Toggle per detrazioni nella sintesi
    if (sintesiDetrazioniToggle) {
        // Imposta come attivo di default
        sintesiDetrazioniToggle.classList.add('active');
        
        sintesiDetrazioniToggle.addEventListener('click', function() {
            sintesiDetrazioniBreakdown.classList.toggle('hidden');
            this.classList.toggle('active');
        });
    }
    
    // Funzione pubblica per ottenere il valore validato
    window.getValidatedRAL = function() {
        const numericValue = unformatNumber(ralInput.value);
        
        if (validateRALInput(numericValue)) {
            return parseInt(numericValue, 10);
        }
        
        return null;
    };
});