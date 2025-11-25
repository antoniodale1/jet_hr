from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Funzioni di calcolo backend

def fondo_pensione(ral, imponibile_fiscale, percentuale_versamento):
    """
    Calcola il nuovo imponibile fiscale al netto dei versamenti al fondo pensione.
    I versamenti sono deducibili fino ad un massimo di € 5164,57 all'anno.
    
    Args:
        ral (float): Reddito Annuo Lordo del dipendente
        imponibile_fiscale (float): Imponibile fiscale prima della deduzione fondo pensione
        percentuale_versamento (float): Percentuale di versamento al fondo pensione (0-15)
    
    Returns:
        tuple: (versamento_effettivo, nuovo_imponibile_fiscale)
            - versamento_effettivo (float): Ammontare effettivo versato al fondo pensione
            - nuovo_imponibile_fiscale (float): Imponibile fiscale al netto della deduzione
    """
    MASSIMO_DEDUCIBILE = 5164.57
    
    if percentuale_versamento <= 0:
        return 0, imponibile_fiscale
    
    # Calcola il versamento effettivo
    versamento_effettivo = ral * (percentuale_versamento / 100)
    
    # Verifica se il versamento è minore o uguale al massimo deducibile
    if versamento_effettivo <= MASSIMO_DEDUCIBILE:
        nuovo_imponibile_fiscale = imponibile_fiscale - versamento_effettivo
    else:
        nuovo_imponibile_fiscale = imponibile_fiscale - MASSIMO_DEDUCIBILE
    
    return versamento_effettivo, nuovo_imponibile_fiscale


def contributi_inps(ral, azienda_grande=True):
    """
    Calcola i contributi INPS a carico del dipendente.
    
    Args:
        ral (float): Reddito Annuo Lordo del dipendente
        azienda_grande (bool): True se azienda con più di 50 dipendenti (9,49%), 
                               False se azienda con meno di 50 dipendenti (9,19%).
                               Default: True
    
    Returns:
        tuple: (contributi_inps, imponibile_fiscale)
            - contributi_inps (float): Ammontare dei contributi INPS versati
            - imponibile_fiscale (float): RAL - contributi INPS
    """
    # Determina l'aliquota INPS in base alla dimensione aziendale
    aliquota_inps = 0.0949 if azienda_grande else 0.0919
    
    # Calcola i contributi INPS
    contributi = ral * aliquota_inps
    
    # Calcola l'imponibile fiscale (RAL - contributi INPS)
    imponibile_fiscale = ral - contributi
    
    return contributi, imponibile_fiscale


def irpef(imponibile_fiscale):
    """
    Calcola l'IRPEF sul reddito imponibile.
    
    Args:
        imponibile_fiscale (float): Reddito imponibile (RAL - contributi INPS)
    
    Returns:
        dict: Dizionario contenente:
            - totale_irpef (float): Totale IRPEF dovuta
            - scaglione_1 (float): IRPEF su reddito da 0 a 28.000€ (23%)
            - scaglione_2 (float): IRPEF su reddito da 28.000 a 50.000€ (35%)
            - scaglione_3 (float): IRPEF su reddito oltre 50.000€ (43%)
    """
    # Inizializza gli scaglioni
    scaglione_1 = 0  # 0 - 28.000 al 23%
    scaglione_2 = 0  # 28.000 - 50.000 al 35%
    scaglione_3 = 0  # oltre 50.000 al 43%
    
    # Calcola IRPEF per scaglione
    if imponibile_fiscale > 0:
        # Primo scaglione: 0 - 28.000€ al 23%
        if imponibile_fiscale <= 28000:
            scaglione_1 = imponibile_fiscale * 0.23
        else:
            scaglione_1 = 28000 * 0.23
            
            # Secondo scaglione: 28.000 - 50.000€ al 35%
            if imponibile_fiscale <= 50000:
                scaglione_2 = (imponibile_fiscale - 28000) * 0.35
            else:
                scaglione_2 = (50000 - 28000) * 0.35
                
                # Terzo scaglione: oltre 50.000€ al 43%
                scaglione_3 = (imponibile_fiscale - 50000) * 0.43
    
    # Calcola il totale
    totale_irpef = scaglione_1 + scaglione_2 + scaglione_3
    
    return {
        'totale_irpef': totale_irpef,
        'scaglione_1': scaglione_1,
        'scaglione_2': scaglione_2,
        'scaglione_3': scaglione_3
    }


def detrazioni_lavoro_dipendente(imponibile_fiscale):
    """
    Calcola le detrazioni da lavoro dipendente.
    
    Args:
        imponibile_fiscale (float): Reddito imponibile (RAL - contributi INPS)
    
    Returns:
        float: Detrazioni da lavoro dipendente
    """
    detrazioni = 0
    
    if imponibile_fiscale <= 15000:
        # Fino a 15.000€
        detrazioni = 1955
    elif imponibile_fiscale <= 28000:
        # Da 15.000€ a 28.000€
        detrazioni = 1910 + 1190 * ((28000 - imponibile_fiscale) / (28000 - 15000))
    elif imponibile_fiscale <= 50000:
        # Da 28.000€ a 50.000€
        detrazioni = 1910 * ((50000 - imponibile_fiscale) / (50000 - 28000))
    else:
        # Oltre 50.000€
        detrazioni = 0
    
    # Bonus aggiuntivo per redditi tra 25.000€ e 35.000€
    if 25000 <= imponibile_fiscale < 35000:
        detrazioni += 65
    
    return detrazioni


def ulteriore_detrazione(imponibile_fiscale):
    """
    Calcola l'ulteriore detrazione.
    
    Args:
        imponibile_fiscale (float): Reddito imponibile (RAL - contributi INPS)
    
    Returns:
        float: Ulteriore detrazione
    """
    ulteriore_detr = 0
    
    if 20000 < imponibile_fiscale <= 32000:
        # Da 20.000€ a 32.000€
        ulteriore_detr = 1000
    elif 32000 < imponibile_fiscale <= 40000:
        # Da 32.000€ a 40.000€
        ulteriore_detr = 1000 * ((40000 - imponibile_fiscale) / 8000)
    else:
        # Fuori range
        ulteriore_detr = 0
    
    return ulteriore_detr


def detrazione_aggiuntive(imponibile_fiscale):
    """
    Calcola le detrazioni aggiuntive da lavoro dipendente.
    
    Args:
        imponibile_fiscale (float): Reddito imponibile (RAL - contributi INPS)
    
    Returns:
        float: Detrazioni aggiuntive da lavoro dipendente
    """
    detrazioni_agg = 0
    
    if imponibile_fiscale <= 8500:
        # Fino a 8.500€: 7.1% dell'imponibile
        detrazioni_agg = imponibile_fiscale * 0.071
    elif imponibile_fiscale <= 15000:
        # Da 8.500€ a 15.000€: 5.3% dell'imponibile
        detrazioni_agg = imponibile_fiscale * 0.053
    elif imponibile_fiscale <= 20000:
        # Da 15.000€ a 20.000€: 4.8% dell'imponibile
        detrazioni_agg = imponibile_fiscale * 0.048
    else:
        # Oltre 20.000€
        detrazioni_agg = 0
    
    return detrazioni_agg


def detrazioni_coniuge_a_carico(imponibile_fiscale):
    """
    Calcola le detrazioni per coniuge a carico.
    
    Args:
        imponibile_fiscale (float): Reddito imponibile (RAL - contributi INPS)
    
    Returns:
        float: Detrazioni per coniuge a carico
    """
    if imponibile_fiscale <= 15000:
        # Fino a 15.000€
        detrazione = 800 - (110 * (imponibile_fiscale / 15000))
    elif imponibile_fiscale <= 40000:
        # Da 15.000€ a 40.000€: base 690 + bonus per fasce specifiche
        detrazione = 690
        
        # Aggiungi bonus in base alle fasce
        if 29000 < imponibile_fiscale <= 29200:
            detrazione += 10
        elif 29200 < imponibile_fiscale <= 34700:
            detrazione += 20
        elif 34700 < imponibile_fiscale <= 35000:
            detrazione += 30
        elif 35000 < imponibile_fiscale <= 35100:
            detrazione += 10
        elif 35100 < imponibile_fiscale <= 35200:
            detrazione += 10
    elif imponibile_fiscale <= 80000:
        # Da 40.000€ a 80.000€: scala progressivamente
        detrazione = 690 * ((80000 - imponibile_fiscale) / 40000)
    else:
        # Oltre 80.000€
        detrazione = 0
    
    return detrazione


def detrazioni_figli_a_carico(imponibile_fiscale, numero_figli):
    """
    Calcola le detrazioni per figli a carico.
    
    Args:
        imponibile_fiscale (float): Reddito imponibile (RAL - contributi INPS)
        numero_figli (int): Numero di figli a carico
    
    Returns:
        float: Detrazioni per figli a carico
    """
    if numero_figli < 1:
        # Nessuna detrazione se non ci sono figli a carico
        return 0
    
    # Calcola il coefficiente correttivo
    numeratore = 80000 - imponibile_fiscale + (15000 * (numero_figli - 1))
    denominatore = 80000 + (15000 * (numero_figli - 1))
    coefficiente = numeratore / denominatore
    
    # Verifica che il coefficiente sia valido (deve essere > 0 e < 1)
    if coefficiente >= 1 or coefficiente <= 0:
        # Non spettano detrazioni
        return 0
    
    # Arrotonda il coefficiente alla quarta cifra decimale
    coefficiente = round(coefficiente, 4)
    
    # Calcola la detrazione
    detrazione = 950 * coefficiente * numero_figli
    
    return detrazione


def trattamento_integrativo(imponibile_fiscale, irpef_totale, detrazioni_lavoro, ulteriore_detr, detrazioni_agg):
    """
    Calcola il trattamento integrativo (bonus Renzi).
    
    Args:
        imponibile_fiscale (float): Reddito imponibile (RAL - contributi INPS)
        irpef_totale (float): IRPEF totale dovuta
        detrazioni_lavoro (float): Detrazioni per lavoro dipendente
        ulteriore_detr (float): Ulteriore detrazione
        detrazioni_agg (float): Detrazioni aggiuntive
    
    Returns:
        float: Ammontare del trattamento integrativo
    """
    if imponibile_fiscale > 28000:
        # Oltre 28.000€ non spetta
        return 0
    elif imponibile_fiscale > 8500 and imponibile_fiscale <= 15000:
        # Tra 8.500€ e 15.000€: 1.200€
        return 1200
    elif imponibile_fiscale > 15000 and imponibile_fiscale <= 28000:
        # Tra 15.000€ e 28.000€: spetta solo se IRPEF < detrazioni (incapienza)
        totale_detrazioni = detrazioni_lavoro + ulteriore_detr + detrazioni_agg
        differenza = totale_detrazioni - irpef_totale
        
        if differenza > 0:
            # Se detrazioni > IRPEF (incapienza), spetta il trattamento
            # pari al minimo tra la differenza e 1.200€
            return min(differenza, 1200)
        else:
            # Se IRPEF >= detrazioni, non spetta
            return 0
    else:
        # Sotto 8.500€ non spetta
        return 0


def imposta_regionale(imponibile_fiscale):
    """
    Calcola l'imposta regionale sul reddito imponibile.
    
    Args:
        imponibile_fiscale (float): Reddito imponibile (RAL - contributi INPS)
    
    Returns:
        float: Ammontare dell'imposta regionale dovuta
    """
    if imponibile_fiscale <= 15000:
        # Fino a 15.000€: 1.23% sul reddito imponibile
        imposta = imponibile_fiscale * 0.0123
    elif imponibile_fiscale <= 28000:
        # Da 15.000€ a 28.000€: 1.23% su 15.000 + 1.58% sulla parte eccedente
        imposta = (15000 * 0.0123) + ((imponibile_fiscale - 15000) * 0.0158)
    elif imponibile_fiscale <= 50000:
        # Da 28.000€ a 50.000€: 1.23% su 15.000 + 1.58% su 13.000 + 1.72% sulla parte eccedente
        imposta = (15000 * 0.0123) + (13000 * 0.0158) + ((imponibile_fiscale - 28000) * 0.0172)
    else:
        # Oltre 50.000€: 1.23% su 15.000 + 1.58% su 13.000 + 1.72% su 22.000 + 1.73% sulla parte eccedente
        imposta = (15000 * 0.0123) + (13000 * 0.0158) + (22000 * 0.0172) + ((imponibile_fiscale - 50000) * 0.0173)
    
    return imposta


def imposta_comunale(imponibile_fiscale):
    """
    Calcola l'imposta comunale sul reddito imponibile.
    
    Args:
        imponibile_fiscale (float): Reddito imponibile (RAL - contributi INPS)
    
    Returns:
        float: Ammontare dell'imposta comunale dovuta
    """
    if imponibile_fiscale < 23000:
        # Sotto 23.000€: nessuna imposta comunale
        imposta = 0
    else:
        # A partire da 23.000€: 0.8% sul reddito imponibile
        imposta = imponibile_fiscale * 0.008
    
    return imposta


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/calcola_inps', methods=['POST'])
def calcola_inps():
    """
    Endpoint API per calcolare i contributi INPS, IRPEF e detrazioni.
    """
    try:
        data = request.get_json()
        ral = float(data.get('ral', 0))
        azienda_grande = data.get('azienda_grande', 'true') == 'true'
        numero_figli = int(data.get('numero_figli', 0))
        coniuge_a_carico = data.get('coniuge_a_carico', False)
        percentuale_fondo_pensione = float(data.get('percentuale_fondo_pensione', 0))
        
        if ral <= 0:
            return jsonify({'error': 'RAL deve essere un valore positivo'}), 400
        
        # Calcola contributi INPS e imponibile fiscale
        contributi, imponibile = contributi_inps(ral, azienda_grande)
        
        # Calcola versamento fondo pensione e nuovo imponibile fiscale
        versamento_fondo, imponibile_netto_fondo = fondo_pensione(ral, imponibile, percentuale_fondo_pensione)
        
        # Usa l'imponibile al netto del fondo pensione per tutti i calcoli successivi
        imponibile_calcolo = imponibile_netto_fondo
        
        # Calcola IRPEF
        irpef_data = irpef(imponibile_calcolo)
        
        # Calcola detrazioni lavoro dipendente
        detrazioni = detrazioni_lavoro_dipendente(imponibile_calcolo)
        
        # Calcola ulteriore detrazione
        ulteriore_detr = ulteriore_detrazione(imponibile_calcolo)
        
        # Calcola detrazioni aggiuntive
        detrazioni_agg = detrazione_aggiuntive(imponibile_calcolo)
        
        # Calcola detrazioni coniuge a carico (solo se toggle attivo)
        detrazioni_coniuge = detrazioni_coniuge_a_carico(imponibile_calcolo) if coniuge_a_carico else 0
        
        # Calcola detrazioni figli a carico
        detrazioni_figli = detrazioni_figli_a_carico(imponibile_calcolo, numero_figli)
        
        # Calcola trattamento integrativo
        trattamento = trattamento_integrativo(
            imponibile_calcolo, 
            irpef_data['totale_irpef'], 
            detrazioni, 
            ulteriore_detr, 
            detrazioni_agg
        )
        
        # Calcola imposta regionale
        imp_regionale = imposta_regionale(imponibile_calcolo)
        
        # Calcola imposta comunale
        imp_comunale = imposta_comunale(imponibile_calcolo)
        
        return jsonify({
            'contributi_inps': round(contributi, 2),
            'imponibile_fiscale': round(imponibile, 2),
            'versamento_fondo_pensione': round(versamento_fondo, 2),
            'imponibile_netto_fondo': round(imponibile_netto_fondo, 2),
            'irpef_totale': round(irpef_data['totale_irpef'], 2),
            'irpef_scaglione_1': round(irpef_data['scaglione_1'], 2),
            'irpef_scaglione_2': round(irpef_data['scaglione_2'], 2),
            'irpef_scaglione_3': round(irpef_data['scaglione_3'], 2),
            'detrazioni_lavoro_dipendente': round(detrazioni, 2),
            'ulteriore_detrazione': round(ulteriore_detr, 2),
            'detrazione_aggiuntive': round(detrazioni_agg, 2),
            'detrazioni_coniuge_a_carico': round(detrazioni_coniuge, 2),
            'detrazioni_figli_a_carico': round(detrazioni_figli, 2),
            'trattamento_integrativo': round(trattamento, 2),
            'imposta_regionale': round(imp_regionale, 2),
            'imposta_comunale': round(imp_comunale, 2)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

