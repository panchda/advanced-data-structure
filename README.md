# Zaawansowane struktury danych – analiza efektywności operacji

Projekt realizowany w ramach przedmiotu **Projekt informatyczny: Zaawansowane zagadnienia algorytmiki i programowania (L1)**.

## Opis projektu

Celem projektu jest implementacja i analiza efektywności wybranych struktur danych. W drugim etapie projektu przygotowano implementacje drzew AVL i Splay Tree w języku TypeScript.

Projekt obejmuje:

- Operacje wstawiania, wyszukiwania i usuwania elementów.
- Automatyczne testy poprawności implementacji.
- Generowanie powtarzalnych danych testowych.
- Wstępne pomiary wydajności.
- Interaktywną wizualizację działania drzew AVL i Splay Tree.

## Wymagania

- Node.js (wersja wykorzystana podczas pomiarów: 20.19.4)
- npm

## Instalacja

Po pobraniu repozytorium należy otworzyć terminal w katalogu głównym projektu i zainstalować zależności:

```bash
npm ci
```

## Uruchamianie testów

Aby uruchomić testy jednostkowe:

```bash
npm test
```

Aby uruchomić testy w trybie obserwacji zmian:

```bash
npm run test:watch
```

Aby sprawdzić poprawność typów TypeScript:

```bash
npm run typecheck
```

## Wstępne pomiary wydajności

Aby uruchomić pomiary:

```bash
npm run benchmark:preliminary
```

Pomiary obejmują drzewa AVL i Splay Tree oraz cztery rodzaje operacji: wstawianie, wyszukiwanie skuteczne, wyszukiwanie nieskuteczne i usuwanie.

Wykorzystywane są zbiory zawierające 1000 i 10 000 elementów, losowa kolejność danych, 10 powtórzeń pomiarowych oraz jedna próba rozgrzewająca. Wyniki prezentowane są w milisekundach jako mediany czasów wykonania całych sekwencji operacji.

## Wizualizacja drzew

### Wizualizacja konsolowa

Aby uruchomić przykładowe operacje na drzewach w terminalu:

```bash
npm run visualize:trees
```

### Interaktywny wizualizator React

Aplikacja wizualizacyjna znajduje się w katalogu `visualizer`.

Aby ją uruchomić:

```bash
cd visualizer
npm ci
npm run dev
```

Następnie należy otworzyć w przeglądarce adres podany przez Vite w terminalu.

Wizualizator umożliwia:

- Wybór drzewa AVL lub Splay Tree.
- Wstawianie, wyszukiwanie i usuwanie kluczy.
- Uruchamianie przykładowych sekwencji operacji.
- Przeglądanie historii zmian struktury drzewa.
- Nawigację pomiędzy kolejnymi stanami za pomocą przycisków `Previous` i `Next`.

## Środowisko pomiarowe

Wstępne pomiary opisane w drugim raporcie przeprowadzono na komputerze MacBook Pro 15″ (2018), wyposażonym w procesor Intel Core i7 (6 rdzeni, 2,2 GHz), 16 GB pamięci RAM oraz system macOS Sequoia 15.7.9.

Wykorzystano środowisko Node.js 20.19.4.

## Zakres drugiego etapu

Niniejsza wersja projektu obejmuje implementację, testowanie, wizualizację oraz wstępną analizę wydajności drzew AVL i Splay Tree. Rozszerzenie badań o tablicę haszującą i bardziej szczegółowe eksperymenty porównawcze przewidziano w kolejnym etapie projektu.
