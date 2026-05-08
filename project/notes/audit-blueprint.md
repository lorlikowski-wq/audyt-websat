# Audit blueprint — extracted from real Nobelica PDF + Excel template

## Brand / context
- **Audytor:** NOBELICA SP. Z O.O., ul. Sobieskiego 11/E6, 40-082 Katowice, KRS 0000478746, NIP 6342821832
- **System:** Web-Sat (telematyka pojazdów)
- **Klient (przykład):** KAMIL SZAREJKO, "KOWALCZYK & SZAREJKO TRANS"
- **Numer audytu:** OKT-2643
- **Pojazd:** DAF
- **Okres:** 20.04.2026 – 03.05.2026 (14 dni)
- **Dystans:** 4 105 km

## Główne wnioski (cover/summary)
- Przepalone paliwo ponad normę: **1 040,45 zł**
- Przekroczenia prędkości > 20 km/h: **14x**
- Możliwy mandat: **6 000 zł**
- Punkty karne ryzyko utraty prawa jazdy: **>3x**
- Brak kontroli systemu e-TOLL (kara: 1500 zł/dzień, KAS ma 5 lat na kontrolę)
- Estymacja strat dla floty 10 pojazdów / 30 dni: **20 809 zł**

## Audyt pojazdu (główna tabela)
| Analizowane dane | Opinia | Dane | Strata |
|---|---|---|---|
| Norma zużycia paliwa /100km | Przekroczona | 31,06 L/100km (norma 28,00) | 849,76 zł |
| Zużyte paliwo na postoju | Przekroczona | 28,25 L → 2,22% | 190,69 zł |
| Czas pracy silnika na postoju >5min | Przekroczona | 4 godz 1 min (najdłuższy 21 min) | — |
| Jazda na tempomacie | Przekroczona | 31,6% wg czasu / 43% wg dystansu | — |
| Współczynnik hamowania silnikiem | W normie | 70% silnik / 30% zasadniczy | — |
| Czas jazdy kierowcy | Nie dotyczy | b.d. | — |
| Czas pracy za granicą | Nie dotyczy | b.d. | — |
| Pobieranie plików DDD | Nie dotyczy | b.d. | — |

## Przekroczenia prędkości (14 wykroczeń, sumarycznie 6000 zł / 88 pkt)
Strona 1: 2026-04-20 09:58 (68 vs 40, 400 zł, 7pkt), 2026-04-20 17:30 (83 vs 50, 800 zł, 9pkt), 2026-04-21 12:38 (75 vs 50, 300 zł, 5pkt), 2026-04-22 10:19 (75 vs 50, 300 zł, 5pkt), 2026-04-23 04:54 (72 vs 50, 300 zł, 5pkt), 2026-04-23 05:13 (77 vs 50, 400 zł, 7pkt), 2026-04-24 11:44 (72 vs 50, 300 zł, 5pkt)
Strona 2: 2026-04-24 11:56 (74 vs 50, 300 zł, 5pkt), 2026-04-27 14:31 (74 vs 50, 300 zł, 5pkt), 2026-04-28 11:58 (85 vs 50, 800 zł, 9pkt), 2026-04-29 09:41 (72 vs 50, 300 zł, 5pkt), 2026-04-29 20:42 (83 vs 50, 800 zł, 9pkt), 2026-04-30 17:02 (72 vs 50, 300 zł, 5pkt), 2026-04-30 18:25 (79 vs 50, 400 zł, 7pkt)

Rozkład prędkości:
- 0–60 km/h: 7,02%
- 61–75 km/h: 8,42%
- 76–80 km/h: 12,11%
- 81–85 km/h: 23,39%
- 86+ km/h: 49,06%

## CSRD / emisja CO2
Pojazd wyprodukował **3 417 kg CO2** w okresie audytu. CSRD = Corporate Sustainability Reporting Directive UE (raportowanie ESG, Fit for 55, redukcja CO2).

## Nacisk na oś
- Rekordowa kara dla polskiego przewoźnika: **124 000 zł**
- Kierowca może być nieświadomy (waga z listu przewozowego ≠ rzeczywistość) — odpowiedzialność: przewoźnik
- Web-Sat odczytuje dane z CAN/CAN FD (do 5 osi + masa brutto)
- W audycie: **Przekroczenie DMC 40t w dn. 27.04.2026**

## Tachograf
- Model: VDO 1381.7550333013(4.1)
- Generacja: G2V2
- Termin legalizacji: 18.03.2028
- Termin wymiany: n.d.
- Weryfikacja zdalna bez pobierania *.ddd dzięki Web-Sat

## LTC (Live Tacho Counters)
Technologia odczytu CPK z tachografu bez plików *.DDD, ponad 20 parametrów. **Brak naruszeń w analizowanym okresie.**

## Wyłączenia 2G w Europie
Lista krajów (UK, Niemcy, Francja, Holandia, Czechy, Litwa, Norwegia, Szwecja, Dania, Finlandia, Irlandia, Islandia, Estonia, Portugalia, Cypr, Malta, Albania, Lichtenstein, Szwajcaria) — większość 31.12.2025.
Pojazd w okresie jeździł po: Polska (do 2028), Litwa (2025/2028).

## Co oferuje Web-Sat (zakończenie)
spalanie na postoju · spalanie ponad normę · upusty paliwa · e-TOLL · prędkość · DDD · 2G · bramownice · giełdy/spedycje

## Excel template (model obliczeń)
Wejścia (B2-B6):
- dystans (km), norma (L/100km), średnie spalanie (L/100km), zużycie na postoju (L), zużycie CAN total (L)
- CENA ON (G3) = 6,4 zł/L

Obliczenia:
- F3 = przepalone L = zużycie_can − zużycie_wg_normy = B6 − B7 ⇒ 174,1 L
- B7 = zużycie wg normy = (dystans/100) × norma ⇒ 1142,4 L
- H3 = przepalone × cena = F3 × cena ⇒ 1114,24 zł
- H4 = zużycie postoju × cena = B5 × cena ⇒ 105,41 zł
- H5 = SUMA strat (1 pojazd) = H3 + H4 ⇒ 1219,65 zł
- H6 = SUMA strat × 2 × 10 (fleet projection) ⇒ 24 393 zł
- A10 = % zużycia na postoju = (B5/B6) × 100 ⇒ 1,25%
