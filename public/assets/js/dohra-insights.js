/**
 * Dohra Road, Bareilly - Locality Insights Detailed Views Controller
 * Powers the 4 insight card detailed views:
 * 1. Property Rates Heatmap ("Explore Rates")
 * 2. Price Trend ("View Price History")
 * 3. Asking Price ("View Verified Listings")
 * 4. Govt. Registrations ("Get Deal Insights")
 */

(function () {
    // -------------------------------------------------------------
    // 1. DATASETS
    // -------------------------------------------------------------

    // A. Dohra Road Properties (Heatmap & General Rates)
    var HEATMAP_PROPERTIES = [
        {
            id: 'doh-01',
            name: "King's Crest Duplex Villas",
            location: "Dohra Road (Near Airport Avenue)",
            subZone: "Kings Crest Belt",
            type: "Villa",
            bhk: "3 BHK Duplex",
            area: 1850,
            rate: 4595,
            totalPrice: "₹ 85.0 Lac",
            totalVal: 8500000,
            status: "Ready to Move",
            approval: "BDA & RERA Approved",
            bracket: "5K"
        },
        {
            id: 'doh-02',
            name: "King's Avenue Luxury Living",
            location: "Main Dohra 4-Lane Avenue",
            subZone: "Kings Crest Belt",
            type: "Villa",
            bhk: "3 BHK Duplex",
            area: 1720,
            rate: 4360,
            totalPrice: "₹ 75.0 Lac",
            totalVal: 7500000,
            status: "Under Construction",
            approval: "BDA Approved",
            bracket: "4K"
        },
        {
            id: 'doh-03',
            name: "JHM Joy Residency",
            location: "Dohra Road Institutional Hub",
            subZone: "University Sector",
            type: "Villa",
            bhk: "3 BHK Villa",
            area: 1680,
            rate: 4285,
            totalPrice: "₹ 72.0 Lac",
            totalVal: 7200000,
            status: "Ready to Move",
            approval: "BDA Approved",
            bracket: "4K"
        },
        {
            id: 'doh-04',
            name: "JHM Ace Commercial Plaza",
            location: "Dohra Road Commercial Center",
            subZone: "JHM Commercial Hub",
            type: "Commercial",
            bhk: "Retail & Offices",
            area: 850,
            rate: 7250,
            totalPrice: "₹ 61.6 Lac",
            totalVal: 6162500,
            status: "Ready for Possession",
            approval: "Commercial Registry",
            bracket: "7K+"
        },
        {
            id: 'doh-05',
            name: "Green Meadows Luxury Villas",
            location: "Opposite Medical University, Dohra Rd",
            subZone: "Airport Corridor",
            type: "Villa",
            bhk: "4 BHK Villa",
            area: 2250,
            rate: 4800,
            totalPrice: "₹ 1.08 Cr",
            totalVal: 10800000,
            status: "Under Construction",
            approval: "BDA Approved",
            bracket: "5K"
        },
        {
            id: 'doh-06',
            name: "Airport Avenue Commercial Suites",
            location: "Dohra Road Airport Turn",
            subZone: "Airport Corridor",
            type: "Commercial",
            bhk: "Showroom Suites",
            area: 1100,
            rate: 6850,
            totalPrice: "₹ 75.3 Lac",
            totalVal: 7535000,
            status: "Ready to Fit-out",
            approval: "BDA Commercial",
            bracket: "7K+"
        },
        {
            id: 'doh-07',
            name: "Rohilkhand University Enclave",
            location: "Near Gate 2, Dohra Road",
            subZone: "University Sector",
            type: "Apartment",
            bhk: "3 BHK Floor",
            area: 1450,
            rate: 3650,
            totalPrice: "₹ 52.9 Lac",
            totalVal: 5292500,
            status: "Ready to Move",
            approval: "Freehold Title",
            bracket: "4K"
        },
        {
            id: 'doh-08',
            name: "Saraswati Vihar Gated Plots",
            location: "Dohra Road (Behind JHM Ace)",
            subZone: "University Sector",
            type: "Plot",
            bhk: "Residential Plot",
            area: 1350,
            rate: 3200,
            totalPrice: "₹ 43.2 Lac",
            totalVal: 4320000,
            status: "Immediate Registry",
            approval: "Freehold BDA Zone",
            bracket: "3K"
        },
        {
            id: 'doh-09',
            name: "Royal Palms Residency",
            location: "Main Dohra Avenue",
            subZone: "Kings Crest Belt",
            type: "Villa",
            bhk: "3 BHK Duplex",
            area: 1900,
            rate: 4650,
            totalPrice: "₹ 88.3 Lac",
            totalVal: 8835000,
            status: "Under Construction",
            approval: "RERA Registered",
            bracket: "5K"
        },
        {
            id: 'doh-10',
            name: "Dohra Heights Executive Towers",
            location: "Suresh Sharma Nagar Extension, Dohra Rd",
            subZone: "Lalpur Connector",
            type: "Apartment",
            bhk: "2 BHK Apartment",
            area: 1150,
            rate: 3400,
            totalPrice: "₹ 39.1 Lac",
            totalVal: 3910000,
            status: "Ready to Move",
            approval: "BDA Approved",
            bracket: "3K"
        },
        {
            id: 'doh-11',
            name: "Mayur Van Greens Township Plots",
            location: "Lalpur Bypass Connector, Dohra",
            subZone: "Lalpur Connector",
            type: "Plot",
            bhk: "Gated Plot",
            area: 1500,
            rate: 2850,
            totalPrice: "₹ 42.7 Lac",
            totalVal: 4275000,
            status: "Immediate Registry",
            approval: "Approved Layout",
            bracket: "3K"
        },
        {
            id: 'doh-12',
            name: "Airport Enclave Residential Plots",
            location: "Northern Airport Gate, Dohra",
            subZone: "Airport Corridor",
            type: "Plot",
            bhk: "Prime Corner Plot",
            area: 1800,
            rate: 3850,
            totalPrice: "₹ 69.3 Lac",
            totalVal: 6930000,
            status: "Immediate Registry",
            approval: "BDA Boundary",
            bracket: "4K"
        },
        {
            id: 'doh-13',
            name: "Krishna Paradise Duplexes",
            location: "Dohra Village Link Road",
            subZone: "Kings Crest Belt",
            type: "Villa",
            bhk: "3 BHK Villa",
            area: 1750,
            rate: 4150,
            totalPrice: "₹ 72.6 Lac",
            totalVal: 7262500,
            status: "Ready to Move",
            approval: "BDA Approved",
            bracket: "4K"
        },
        {
            id: 'doh-14',
            name: "Bareilly Medical City Enclave",
            location: "Dohra Road Hospital Belt",
            subZone: "Airport Corridor",
            type: "Apartment",
            bhk: "2 BHK Floor",
            area: 1200,
            rate: 3150,
            totalPrice: "₹ 37.8 Lac",
            totalVal: 3780000,
            status: "Ready to Move",
            approval: "Freehold Title",
            bracket: "3K"
        },
        {
            id: 'doh-15',
            name: "Aura Commercial Square",
            location: "Opposite JHM Ace, Dohra Road",
            subZone: "JHM Commercial Hub",
            type: "Commercial",
            bhk: "Office Suite",
            area: 620,
            rate: 6800,
            totalPrice: "₹ 42.1 Lac",
            totalVal: 4216000,
            status: "Under Construction",
            approval: "Commercial Sanction",
            bracket: "7K+"
        },
        {
            id: 'doh-15b',
            name: "Aura Executive Boutique Suites",
            location: "Dohra Commercial Strip",
            subZone: "JHM Commercial Hub",
            type: "Commercial",
            bhk: "Studio Suite",
            area: 680,
            rate: 5850,
            totalPrice: "₹ 39.7 Lac",
            totalVal: 3978000,
            status: "Ready for Fit-out",
            approval: "Commercial BDA",
            bracket: "6.5K"
        },
        {
            id: 'doh-15c',
            name: "Dohra Boulevard Luxury Penthouse",
            location: "Airport Road Junction, Dohra",
            subZone: "Airport Corridor",
            type: "Villa",
            bhk: "4 BHK Sky Villa",
            area: 2450,
            rate: 6100,
            totalPrice: "₹ 1.49 Cr",
            totalVal: 14945000,
            status: "Under Construction",
            approval: "RERA Registered",
            bracket: "6.5K"
        },
        {
            id: 'doh-16',
            name: "Shiv Shakti Enclave Plots",
            location: "Peripheral Dohra Green Belt",
            subZone: "Peripheral Greens",
            type: "Plot",
            bhk: "Residential Plot",
            area: 1250,
            rate: 2450,
            totalPrice: "₹ 30.6 Lac",
            totalVal: 3062500,
            status: "Immediate Registry",
            approval: "Freehold Mutated",
            bracket: "<2.5K"
        },
        {
            id: 'doh-17',
            name: "Greenfield Farm Plots",
            location: "Dohra Outskirts, Rural Link",
            subZone: "Peripheral Greens",
            type: "Plot",
            bhk: "Farm Plot",
            area: 2500,
            rate: 2200,
            totalPrice: "₹ 55.0 Lac",
            totalVal: 5500000,
            status: "Immediate Registry",
            approval: "Clear Title",
            bracket: "<2.5K"
        },
        {
            id: 'doh-18',
            name: "The Grand Avenue Duplex",
            location: "Airport Road Junction, Dohra",
            subZone: "Airport Corridor",
            type: "Villa",
            bhk: "4 BHK Ultra Villa",
            area: 2400,
            rate: 5100,
            totalPrice: "₹ 1.22 Cr",
            totalVal: 12240000,
            status: "Under Construction",
            approval: "RERA Registered",
            bracket: "5K"
        },
        {
            id: 'doh-19',
            name: "Surya Valley Villas",
            location: "Near Rohilkhand University",
            subZone: "University Sector",
            type: "Villa",
            bhk: "3 BHK Villa",
            area: 1650,
            rate: 3950,
            totalPrice: "₹ 65.1 Lac",
            totalVal: 6517500,
            status: "Ready to Move",
            approval: "BDA Approved",
            bracket: "4K"
        },
        {
            id: 'doh-20',
            name: "Lalpur Commercial Strip",
            location: "Bada Bypass & Dohra Junction",
            subZone: "Lalpur Connector",
            type: "Commercial",
            bhk: "Corner Plot",
            area: 2000,
            rate: 5400,
            totalPrice: "₹ 1.08 Cr",
            totalVal: 10800000,
            status: "Immediate Registry",
            approval: "Commercial Zone",
            bracket: "5K"
        },
        {
            id: 'doh-21',
            name: "Skyview Heights Residence",
            location: "Dohra Road",
            subZone: "Kings Crest Belt",
            type: "Apartment",
            bhk: "3 BHK Luxury",
            area: 1550,
            rate: 4200,
            totalPrice: "₹ 65.1 Lac",
            totalVal: 6510000,
            status: "Under Construction",
            approval: "BDA Sanctioned",
            bracket: "4K"
        },
        {
            id: 'doh-22',
            name: "Palm Court Duplexes",
            location: "Dohra 4-Lane Avenue",
            subZone: "Kings Crest Belt",
            type: "Villa",
            bhk: "3 BHK Duplex",
            area: 1800,
            rate: 4500,
            totalPrice: "₹ 81.0 Lac",
            totalVal: 8100000,
            status: "Ready to Move",
            approval: "BDA Approved",
            bracket: "5K"
        },
        {
            id: 'doh-23',
            name: "Dohra Smart City Commercial Hub",
            location: "Near Ace Plaza, Dohra Road",
            subZone: "JHM Commercial Hub",
            type: "Commercial",
            bhk: "Commercial Shop",
            area: 450,
            rate: 7600,
            totalPrice: "₹ 34.2 Lac",
            totalVal: 3420000,
            status: "Ready to Move",
            approval: "Commercial Registry",
            bracket: "7K+"
        },
        {
            id: 'doh-24',
            name: "Eldeco Greens Extended Plot",
            location: "Dohra - Lalpur Belt",
            subZone: "Lalpur Connector",
            type: "Plot",
            bhk: "Corner Plot",
            area: 1600,
            rate: 3450,
            totalPrice: "₹ 55.2 Lac",
            totalVal: 5520000,
            status: "Immediate Registry",
            approval: "BDA Layout",
            bracket: "3K"
        }
    ];

    // B. Price Trend Dataset (Q4 '25 to Q3 '26)
    var TREND_QUARTERS = [
        {
            quarter: "Q4 '25",
            period: "Oct - Dec 2025",
            rate: 3600,
            growth: "Baseline",
            transactions: 110,
            volumeCr: "₹ 58.4 Cr"
        },
        {
            quarter: "Q1 '26",
            period: "Jan - Mar 2026",
            rate: 3850,
            growth: "+6.9% QoQ",
            transactions: 142,
            volumeCr: "₹ 74.2 Cr"
        },
        {
            quarter: "Q2 '26",
            period: "Apr - Jun 2026",
            rate: 4050,
            growth: "+5.2% QoQ",
            transactions: 178,
            volumeCr: "₹ 92.5 Cr"
        },
        {
            quarter: "Q3 '26",
            period: "Jul - Sep 2026",
            rate: 4250,
            growth: "+4.9% QoQ",
            transactions: 215,
            volumeCr: "₹ 114.8 Cr"
        }
    ];

    var TREND_BENCHMARKS = [
        // Q3 '26
        {
            quarter: "Q3 '26",
            date: "24 Sep 2026",
            property: "King's Crest Phase 2 (Villa 18)",
            type: "Villa",
            area: 1850,
            rate: 4595,
            totalPrice: "₹ 85.0 Lac",
            totalVal: 8500000,
            movement: "+5.6% vs Q2",
            benchmarkSource: "Sub-Registrar I Registry #4912"
        },
        {
            quarter: "Q3 '26",
            date: "12 Sep 2026",
            property: "JHM Ace Commercial (Unit 104)",
            type: "Commercial",
            area: 850,
            rate: 7250,
            totalPrice: "₹ 61.6 Lac",
            totalVal: 6162500,
            movement: "+6.2% vs Q2",
            benchmarkSource: "IGRSUP Commercial Record #3902"
        },
        {
            quarter: "Q3 '26",
            date: "29 Aug 2026",
            property: "King's Avenue (Villa 05)",
            type: "Villa",
            area: 1720,
            rate: 4360,
            totalPrice: "₹ 75.0 Lac",
            totalVal: 7500000,
            movement: "+4.8% vs Q2",
            benchmarkSource: "Sub-Registrar I Deed #3210"
        },
        {
            quarter: "Q3 '26",
            date: "15 Aug 2026",
            property: "Airport Enclave (Plot 24)",
            type: "Plot",
            area: 1800,
            rate: 3850,
            totalPrice: "₹ 69.3 Lac",
            totalVal: 6930000,
            movement: "+4.1% vs Q2",
            benchmarkSource: "Sub-Registrar II Registry #2880"
        },
        {
            quarter: "Q3 '26",
            date: "02 Jul 2026",
            property: "Rohilkhand Enclave (Floor 201)",
            type: "Apartment",
            area: 1450,
            rate: 3650,
            totalPrice: "₹ 52.9 Lac",
            totalVal: 5292500,
            movement: "+4.3% vs Q2",
            benchmarkSource: "Deed Certified #2140"
        },

        // Q2 '26
        {
            quarter: "Q2 '26",
            date: "25 Jun 2026",
            property: "King's Crest (Villa 11)",
            type: "Villa",
            area: 1850,
            rate: 4350,
            totalPrice: "₹ 80.5 Lac",
            totalVal: 8050000,
            movement: "+4.8% vs Q1",
            benchmarkSource: "Sub-Registrar I Registry #2714"
        },
        {
            quarter: "Q2 '26",
            date: "14 May 2026",
            property: "JHM Joy Residency (Villa 14)",
            type: "Villa",
            area: 1680,
            rate: 4150,
            totalPrice: "₹ 69.7 Lac",
            totalVal: 6972000,
            movement: "+5.1% vs Q1",
            benchmarkSource: "Sub-Registrar I Deed #2218"
        },
        {
            quarter: "Q2 '26",
            date: "04 May 2026",
            property: "Saraswati Vihar (Plot 76)",
            type: "Plot",
            area: 1350,
            rate: 3200,
            totalPrice: "₹ 43.2 Lac",
            totalVal: 4320000,
            movement: "+6.7% vs Q1",
            benchmarkSource: "Sub-Registrar II Deed #1844"
        },
        {
            quarter: "Q2 '26",
            date: "18 Apr 2026",
            property: "Green Meadows (Villa 04)",
            type: "Villa",
            area: 2250,
            rate: 4600,
            totalPrice: "₹ 1.03 Cr",
            totalVal: 10350000,
            movement: "+4.5% vs Q1",
            benchmarkSource: "IGRSUP Benchmark #1620"
        },

        // Q1 '26
        {
            quarter: "Q1 '26",
            date: "22 Mar 2026",
            property: "King's Avenue (Villa 19)",
            type: "Villa",
            area: 1720,
            rate: 4150,
            totalPrice: "₹ 71.3 Lac",
            totalVal: 7138000,
            movement: "+7.8% vs Q4",
            benchmarkSource: "Sub-Registrar I Registry #1204"
        },
        {
            quarter: "Q1 '26",
            date: "10 Mar 2026",
            property: "Mayur Van Greens (Plot 32)",
            type: "Plot",
            area: 1500,
            rate: 2850,
            totalPrice: "₹ 42.7 Lac",
            totalVal: 4275000,
            movement: "+5.6% vs Q4",
            benchmarkSource: "Sub-Registrar II Deed #0988"
        },
        {
            quarter: "Q1 '26",
            date: "19 Feb 2026",
            property: "Rohilkhand Enclave (Floor 102)",
            type: "Apartment",
            area: 1450,
            rate: 3500,
            totalPrice: "₹ 50.7 Lac",
            totalVal: 5075000,
            movement: "+6.1% vs Q4",
            benchmarkSource: "Sub-Registrar I Deed #0712"
        },
        {
            quarter: "Q1 '26",
            date: "28 Jan 2026",
            property: "Lalpur Connector Strip (Plot C4)",
            type: "Commercial",
            area: 2000,
            rate: 5100,
            totalPrice: "₹ 1.02 Cr",
            totalVal: 10200000,
            movement: "+6.2% vs Q4",
            benchmarkSource: "Commercial Registry #0412"
        },

        // Q4 '25
        {
            quarter: "Q4 '25",
            date: "20 Dec 2025",
            property: "King's Crest (Initial Launch Villa 02)",
            type: "Villa",
            area: 1850,
            rate: 3950,
            totalPrice: "₹ 73.0 Lac",
            totalVal: 7307500,
            movement: "Launch Rate",
            benchmarkSource: "Sub-Registrar I Registry #6412"
        },
        {
            quarter: "Q4 '25",
            date: "05 Dec 2025",
            property: "JHM Joy (Villa 01)",
            type: "Villa",
            area: 1680,
            rate: 3800,
            totalPrice: "₹ 63.8 Lac",
            totalVal: 6384000,
            movement: "Baseline",
            benchmarkSource: "Sub-Registrar I Registry #5980"
        },
        {
            quarter: "Q4 '25",
            date: "14 Nov 2025",
            property: "Saraswati Vihar (Plot 44)",
            type: "Plot",
            area: 1350,
            rate: 3000,
            totalPrice: "₹ 40.5 Lac",
            totalVal: 4050000,
            movement: "Baseline",
            benchmarkSource: "Sub-Registrar II Registry #5210"
        },
        {
            quarter: "Q4 '25",
            date: "22 Oct 2025",
            property: "Shiv Shakti Enclave (Plot 18)",
            type: "Plot",
            area: 1250,
            rate: 2300,
            totalPrice: "₹ 28.7 Lac",
            totalVal: 2875000,
            movement: "Baseline",
            benchmarkSource: "Deed Record #4811"
        }
    ];

    // C. Govt. Registrations Dataset (5-8 Detailed Registered Deals)
    var GOVT_DEALS = [
        {
            deedNo: "BRL-DOH-2026-004812",
            date: "18 Sep 2026",
            sro: "Sub-Registrar Office I, Bareilly",
            property: "Villa B-14, Kings Crest Duplex Society",
            location: "Dohra Road, Bareilly",
            type: "Residential Duplex Villa",
            areaSqft: 1850,
            areaSqm: 171.87,
            grossValue: "₹ 82,50,000",
            grossValNum: 8250000,
            registeredRate: 4459,
            stampDuty: "₹ 5,77,500 (7%)",
            regFee: "₹ 82,500 (1%)",
            circleRate: "₹ 3,200/sq.ft",
            marketPremium: "+39.3% over circle rate",
            status: "Title Registered & Tax Receipt Generated"
        },
        {
            deedNo: "BRL-DOH-2026-003920",
            date: "04 Aug 2026",
            sro: "Sub-Registrar Office I, Bareilly",
            property: "Commercial Unit GF-08, JHM Ace Commercial",
            location: "Main Dohra Road, Bareilly",
            type: "Commercial Retail Suite",
            areaSqft: 850,
            areaSqm: 78.96,
            grossValue: "₹ 61,62,500",
            grossValNum: 6162500,
            registeredRate: 7250,
            stampDuty: "₹ 4,93,000 (8%)",
            regFee: "₹ 61,625 (1%)",
            circleRate: "₹ 4,800/sq.ft",
            marketPremium: "+51.0% over circle rate",
            status: "Sale Deed Executed & Possessed"
        },
        {
            deedNo: "BRL-DOH-2026-003115",
            date: "12 Jul 2026",
            sro: "Sub-Registrar Office II, Bareilly",
            property: "Plot No. 68, Green Meadows Phase 1",
            location: "Dohra Road (Opp. Medical University)",
            type: "Residential Freehold Plot",
            areaSqft: 1500,
            areaSqm: 139.35,
            grossValue: "₹ 42,75,000",
            grossValNum: 4275000,
            registeredRate: 2850,
            stampDuty: "₹ 2,99,250 (7%)",
            regFee: "₹ 42,750 (1%)",
            circleRate: "₹ 2,400/sq.ft",
            marketPremium: "+18.8% over circle rate",
            status: "Freehold Registry Complete"
        },
        {
            deedNo: "BRL-DOH-2026-002840",
            date: "28 Jun 2026",
            sro: "Sub-Registrar Office I, Bareilly",
            property: "Villa 22, King's Avenue Gated Sector",
            location: "Dohra Road, Bareilly",
            type: "3 BHK Duplex Villa",
            areaSqft: 1720,
            areaSqm: 159.79,
            grossValue: "₹ 74,50,000",
            grossValNum: 7450000,
            registeredRate: 4331,
            stampDuty: "₹ 5,21,500 (7%)",
            regFee: "₹ 74,500 (1%)",
            circleRate: "₹ 3,200/sq.ft",
            marketPremium: "+35.3% over circle rate",
            status: "Registered & Mutation Applied"
        },
        {
            deedNo: "BRL-DOH-2026-002190",
            date: "15 May 2026",
            sro: "Sub-Registrar Office I, Bareilly",
            property: "Unit 302, Tower B, Rohilkhand Enclave",
            location: "Dohra Road, Near University",
            type: "3 BHK Apartment",
            areaSqft: 1450,
            areaSqm: 134.70,
            grossValue: "₹ 51,90,000",
            grossValNum: 5190000,
            registeredRate: 3579,
            stampDuty: "₹ 3,63,300 (7%)",
            regFee: "₹ 51,900 (1%)",
            circleRate: "₹ 2,900/sq.ft",
            marketPremium: "+23.4% over circle rate",
            status: "Registered & Possession Granted"
        },
        {
            deedNo: "BRL-DOH-2026-001744",
            date: "22 Apr 2026",
            sro: "Sub-Registrar Office II, Bareilly",
            property: "Plot No. 112, Saraswati Vihar",
            location: "Dohra Road, Bareilly",
            type: "Residential Plot",
            areaSqft: 1350,
            areaSqm: 125.41,
            grossValue: "₹ 43,20,000",
            grossValNum: 4320000,
            registeredRate: 3200,
            stampDuty: "₹ 3,02,400 (7%)",
            regFee: "₹ 43,200 (1%)",
            circleRate: "₹ 2,500/sq.ft",
            marketPremium: "+28.0% over circle rate",
            status: "Sale Deed Executed"
        },
        {
            deedNo: "BRL-DOH-2026-001088",
            date: "09 Mar 2026",
            sro: "Sub-Registrar Office I, Bareilly",
            property: "Villa 09, JHM Joy Residency",
            location: "Dohra Road, Bareilly",
            type: "3 BHK Duplex Villa",
            areaSqft: 1680,
            areaSqm: 156.07,
            grossValue: "₹ 71,80,000",
            grossValNum: 7180000,
            registeredRate: 4273,
            stampDuty: "₹ 5,02,600 (7%)",
            regFee: "₹ 71,800 (1%)",
            circleRate: "₹ 3,100/sq.ft",
            marketPremium: "+37.8% over circle rate",
            status: "Sale Deed Executed & Handed Over"
        },
        {
            deedNo: "BRL-DOH-2026-000650",
            date: "17 Feb 2026",
            sro: "Sub-Registrar Office I, Bareilly",
            property: "Plot C-4, Lalpur Bypass Connector",
            location: "Dohra Road - Bada Bypass",
            type: "Commercial / Mixed Plot",
            areaSqft: 2000,
            areaSqm: 185.80,
            grossValue: "₹ 1,08,00,000",
            grossValNum: 10800000,
            registeredRate: 5400,
            stampDuty: "₹ 7,56,000 (7%)",
            regFee: "₹ 1,08,000 (1%)",
            circleRate: "₹ 3,800/sq.ft",
            marketPremium: "+42.1% over circle rate",
            status: "Clear Title Commercial Deed"
        }
    ];

    // -------------------------------------------------------------
    // 2. STATE MANAGEMENT
    // -------------------------------------------------------------
    var state = {
        activeView: 'heatmap', // 'heatmap' | 'trend' | 'listings' | 'deals'
        searchTerm: '',
        propertyTypeFilter: 'all',
        subZoneFilter: 'all',
        priceBracketFilter: 'all', // '<2.5K', '3K', '4K', '5K', '6.5K', '7K+', 'all'
        quarterFilter: 'all', // "Q4 '25", "Q1 '26", "Q2 '26", "Q3 '26", "all"
        sortBy: 'rate_desc',
        currentPage: 1,
        itemsPerPage: 8,
        isLoading: false
    };

    function cleanSearchStr(s) {
        return (s || '').toLowerCase().replace(/['’`\s\-_.,]/g, '');
    }

    function matchesSearch(item, term) {
        if (!term) return true;
        var q = term.toLowerCase().trim();
        var qClean = cleanSearchStr(q);
        var full = [
            item.name, item.property, item.location, item.type,
            item.subZone, item.bhk, item.approval, item.deedNo,
            item.sro, item.benchmarkSource, item.quarter
        ].filter(Boolean).join(' ');

        return full.toLowerCase().includes(q) || cleanSearchStr(full).includes(qClean);
    }

    // -------------------------------------------------------------
    // 3. CORE VIEW CONTROLLERS
    // -------------------------------------------------------------
    window.openDohraInsightView = function (viewType) {
        state.activeView = viewType || 'heatmap';
        state.currentPage = 1;
        state.searchTerm = '';
        state.propertyTypeFilter = 'all';
        state.subZoneFilter = 'all';
        state.priceBracketFilter = 'all';
        state.quarterFilter = 'all';
        state.sortBy = 'rate_desc';

        var cardsRow = document.getElementById('dohraInsightCardsRow');
        var detailContainer = document.getElementById('dohraInsightDetailContainer');

        if (cardsRow) {
            cardsRow.style.display = 'none';
        }
        if (detailContainer) {
            detailContainer.style.display = 'block';
            renderContainerShell();
            renderActiveView();

            // Smooth scroll to detail container with 60px header offset
            var rect = detailContainer.getBoundingClientRect();
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var targetY = rect.top + scrollTop - 70;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
    };

    window.closeDohraInsightView = function () {
        var cardsRow = document.getElementById('dohraInsightCardsRow');
        var detailContainer = document.getElementById('dohraInsightDetailContainer');

        if (detailContainer) {
            detailContainer.style.display = 'none';
        }
        if (cardsRow) {
            cardsRow.style.display = 'flex';
            // Smooth scroll back to cards row
            var rect = cardsRow.getBoundingClientRect();
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var targetY = rect.top + scrollTop - 70;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
    };

    window.switchDohraInsightTab = function (viewType) {
        state.activeView = viewType;
        state.currentPage = 1;
        state.searchTerm = '';
        state.propertyTypeFilter = 'all';
        state.subZoneFilter = 'all';
        state.priceBracketFilter = 'all';
        state.quarterFilter = 'all';
        state.sortBy = 'rate_desc';

        renderContainerShell();
        renderActiveView();
    };

    // -------------------------------------------------------------
    // 4. RENDERING FUNCTIONS
    // -------------------------------------------------------------
    function renderContainerShell() {
        var container = document.getElementById('dohraInsightDetailContainer');
        if (!container) return;

        var viewTitle = "";
        if (state.activeView === 'heatmap') viewTitle = "Property Rates Heatmap";
        else if (state.activeView === 'trend') viewTitle = "Quarterly Price Trend";
        else if (state.activeView === 'listings') viewTitle = "Active Verified Listings";
        else if (state.activeView === 'deals') viewTitle = "Official Govt. Registrations";

        container.innerHTML = `
            <!-- Top Header & Navigation -->
            <div class="dohra-detail-header">
                <div>
                    <button type="button" class="dohra-back-btn" onclick="closeDohraInsightView()">
                        ← Back to Cards
                    </button>
                    <div class="dohra-breadcrumb" style="margin-top:8px;">
                        <span>Bareilly</span>
                        <span class="sep">/</span>
                        <span>Dohra Road</span>
                        <span class="sep">/</span>
                        <strong>${viewTitle}</strong>
                    </div>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:12px;color:#64748b;display:block;">Locality Benchmark:</span>
                    <strong style="font-size:16px;color:#0f172a;">Dohra Road Corridor</strong>
                </div>
            </div>

            <!-- View Switcher Tabs -->
            <div class="dohra-view-tabs scrollbar-hide">
                <button type="button" class="dohra-view-tab ${state.activeView === 'heatmap' ? 'active' : ''}" onclick="switchDohraInsightTab('heatmap')">
                    🗺️ Property Rates Heatmap <span class="dohra-tab-badge">24+ Projects</span>
                </button>
                <button type="button" class="dohra-view-tab ${state.activeView === 'trend' ? 'active' : ''}" onclick="switchDohraInsightTab('trend')">
                    📈 Price Trend (Q4'25 - Q3'26) <span class="dohra-tab-badge">+18.1% YoY</span>
                </button>
                <button type="button" class="dohra-view-tab ${state.activeView === 'listings' ? 'active' : ''}" onclick="switchDohraInsightTab('listings')">
                    📋 Verified Listings <span class="dohra-tab-badge">1,420+ Active</span>
                </button>
                <button type="button" class="dohra-view-tab ${state.activeView === 'deals' ? 'active' : ''}" onclick="switchDohraInsightTab('deals')">
                    🏛️ Govt. Registrations <span class="dohra-tab-badge">14,820 Deals</span>
                </button>
            </div>

            <!-- Dynamic Content Area -->
            <div id="dohraViewContent"></div>
        `;
    }

    function renderActiveView() {
        var contentDiv = document.getElementById('dohraViewContent');
        if (!contentDiv) return;

        // Show brief shimmer skeleton for smooth feedback
        contentDiv.innerHTML = `
            <div class="dohra-loading-skeleton">
                <div class="dohra-skeleton-row"></div>
                <div class="dohra-skeleton-row"></div>
                <div class="dohra-skeleton-row"></div>
                <div class="dohra-skeleton-row"></div>
            </div>
        `;

        setTimeout(function () {
            if (state.activeView === 'heatmap') {
                renderHeatmapView(contentDiv);
            } else if (state.activeView === 'trend') {
                renderTrendView(contentDiv);
            } else if (state.activeView === 'listings') {
                renderListingsView(contentDiv);
            } else if (state.activeView === 'deals') {
                renderDealsView(contentDiv);
            }
        }, 80);
    }

    // -------------------------------------------------------------
    // VIEW 1: PROPERTY RATES HEATMAP
    // -------------------------------------------------------------
    function renderHeatmapView(container) {
        var subZones = [
            { name: "Airport Corridor", rate: "₹4,850/sq.ft", range: "₹4,500 - 5,800", count: "8 Projects", cls: "zone-high" },
            { name: "JHM Commercial Hub", rate: "₹7,250/sq.ft", range: "₹6,500 - 7,600", count: "4 Projects", cls: "zone-comm" },
            { name: "Kings Crest Belt", rate: "₹4,450/sq.ft", range: "₹4,200 - 4,800", count: "7 Projects", cls: "zone-mid-high" },
            { name: "University Sector", rate: "₹3,650/sq.ft", range: "₹3,400 - 3,950", count: "6 Projects", cls: "zone-mid" },
            { name: "Lalpur Connector", rate: "₹3,200/sq.ft", range: "₹2,800 - 3,500", count: "5 Projects", cls: "zone-entry" },
            { name: "Peripheral Greens", rate: "₹2,350/sq.ft", range: "₹2,200 - 2,500", count: "3 Projects", cls: "zone-entry" }
        ];

        var html = `
            <!-- Top Banner -->
            <div class="dohra-view-banner heatmap-banner">
                <div class="dohra-banner-title">
                    <h3>🗺️ Dohra Road Micro-Market Rates Heatmap</h3>
                    <p>Live density & micro-market rates across Dohra Road's 6 designated development sectors.</p>
                </div>
                <div class="dohra-banner-stats">
                    <div class="dohra-stat-pill">
                        <span class="label">Average Rate</span>
                        <strong class="val" style="color:#0284c7;">₹ 4,250 /sq.ft</strong>
                    </div>
                    <div class="dohra-stat-pill">
                        <span class="label">Price Range</span>
                        <strong class="val">₹ 2,200 - 7,600</strong>
                    </div>
                    <div class="dohra-stat-pill">
                        <span class="label">Highest Value Zone</span>
                        <strong class="val" style="color:#6b21a8;">JHM Hub (₹7.2K+)</strong>
                    </div>
                </div>
            </div>

            <!-- Interactive Heatmap Micro-Market Grid -->
            <div class="dohra-visual-widget">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <div>
                        <strong style="font-size:14px;color:#1e293b;">Interactive Micro-Market Rate Clusters</strong>
                        <span style="font-size:12px;color:#64748b;margin-left:8px;">(Click any zone to filter the property list below)</span>
                    </div>
                    <button type="button" class="dohra-reset-btn" onclick="filterHeatmapZone('all')" style="height:30px;padding:0 10px;font-size:11px;">
                        Show All Zones
                    </button>
                </div>

                <div class="dohra-heatmap-grid">
                    ${subZones.map(function (z) {
                        var isAct = state.subZoneFilter === z.name;
                        return `
                            <div class="dohra-heatmap-card ${z.cls} ${isAct ? 'active' : ''}" onclick="filterHeatmapZone('${z.name}')">
                                <div>
                                    <div class="zone-name">${z.name}</div>
                                    <div class="zone-rate">${z.rate}</div>
                                </div>
                                <div class="zone-sub">${z.range} • ${z.count}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Toolbar Controls -->
            ${renderToolbar('heatmap')}

            <!-- Table / Mobile Cards -->
            <div id="dohraDataTableContainer"></div>
        `;

        container.innerHTML = html;
        renderHeatmapTable();
    }

    window.filterHeatmapZone = function (zone) {
        state.subZoneFilter = zone;
        state.currentPage = 1;
        renderActiveView();
    };

    function renderHeatmapTable() {
        var target = document.getElementById('dohraDataTableContainer');
        if (!target) return;

        // Filter and Sort
        var list = HEATMAP_PROPERTIES.slice();

        // 1. Search filter
        if (state.searchTerm) {
            list = list.filter(function (p) {
                return matchesSearch(p, state.searchTerm);
            });
        }

        // 2. Zone filter
        if (state.subZoneFilter && state.subZoneFilter !== 'all') {
            list = list.filter(function (p) {
                return p.subZone === state.subZoneFilter;
            });
        }

        // 3. Type filter
        if (state.propertyTypeFilter && state.propertyTypeFilter !== 'all') {
            list = list.filter(function (p) {
                return p.type.toLowerCase() === state.propertyTypeFilter.toLowerCase();
            });
        }

        // 4. Sort
        applySorting(list);

        // Check empty state
        if (list.length === 0) {
            target.innerHTML = renderEmptyState();
            return;
        }

        // Pagination slice
        var total = list.length;
        var totalPages = Math.ceil(total / state.itemsPerPage);
        if (state.currentPage > totalPages) state.currentPage = totalPages;
        var startIdx = (state.currentPage - 1) * state.itemsPerPage;
        var paginated = list.slice(startIdx, startIdx + state.itemsPerPage);

        // Render Desktop Table & Mobile Cards
        var tableHtml = `
            <div class="dohra-table-wrap">
                <table class="dohra-table">
                    <thead>
                        <tr>
                            <th>Property & Project</th>
                            <th>Sub-Zone</th>
                            <th>Type & Size</th>
                            <th>Rate (₹/sq.ft)</th>
                            <th>Total Price</th>
                            <th>Status & Approval</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginated.map(function (p) {
                            return `
                                <tr>
                                    <td>
                                        <div class="prop-title-cell">
                                            <strong>${p.name}</strong>
                                            <span class="loc"><em class="icon-pin-locality"></em> ${p.location}</span>
                                        </div>
                                    </td>
                                    <td><span class="badge-tag badge-blue">${p.subZone}</span></td>
                                    <td>
                                        <strong>${p.bhk}</strong>
                                        <div style="font-size:12px;color:#64748b;">${p.area.toLocaleString()} sq.ft</div>
                                    </td>
                                    <td>
                                        <div class="rate-cell">₹ ${p.rate.toLocaleString()} /sq.ft</div>
                                    </td>
                                    <td>
                                        <div class="total-cell">${p.totalPrice}</div>
                                    </td>
                                    <td>
                                        <span class="badge-tag badge-green">${p.approval}</span>
                                        <div style="font-size:11px;color:#64748b;margin-top:3px;">${p.status}</div>
                                    </td>
                                    <td>
                                        <a href="contact-us.html" class="btn" style="height:32px;padding:0 12px;background:#ffd916;color:#1e293b;font-size:12px;font-weight:700;border-radius:6px;display:inline-flex;align-items:center;">
                                            Enquire
                                        </a>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Mobile Card View -->
            <div class="dohra-mobile-cards">
                ${paginated.map(function (p) {
                    return `
                        <div class="dohra-m-card">
                            <div class="dohra-m-card-header">
                                <div>
                                    <strong style="font-size:15px;color:#0f172a;display:block;">${p.name}</strong>
                                    <span style="font-size:12px;color:#64748b;">${p.location}</span>
                                </div>
                                <span class="badge-tag badge-blue">${p.subZone}</span>
                            </div>
                            <div class="dohra-m-card-rates">
                                <div>
                                    <span style="font-size:11px;color:#64748b;display:block;">Rate / Sq.Ft</span>
                                    <strong style="font-size:16px;color:#0369a1;">₹ ${p.rate.toLocaleString()}</strong>
                                </div>
                                <div style="text-align:right;">
                                    <span style="font-size:11px;color:#64748b;display:block;">Total Price</span>
                                    <strong style="font-size:16px;color:#0f172a;">${p.totalPrice}</strong>
                                </div>
                            </div>
                            <div class="dohra-m-card-meta">
                                <span>📐 ${p.bhk} (${p.area.toLocaleString()} sq.ft)</span>
                                <span>🏷️ ${p.approval}</span>
                            </div>
                            <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;">
                                <span style="font-size:11px;color:#10b981;font-weight:600;">● ${p.status}</span>
                                <a href="contact-us.html" class="btn" style="height:34px;padding:0 14px;background:#ffd916;color:#1e293b;font-size:12px;font-weight:700;border-radius:6px;display:inline-flex;align-items:center;">
                                    Enquire Now
                                </a>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Pagination Bar -->
            ${renderPagination(startIdx + 1, Math.min(startIdx + state.itemsPerPage, total), total, totalPages)}
        `;

        target.innerHTML = tableHtml;
    }

    // -------------------------------------------------------------
    // VIEW 2: PRICE TREND & QUARTERLY BENCHMARKS
    // -------------------------------------------------------------
    function renderTrendView(container) {
        var html = `
            <!-- Top Banner -->
            <div class="dohra-view-banner trend-banner">
                <div class="dohra-banner-title">
                    <h3>📈 Dohra Road Quarterly Price Trend History</h3>
                    <p>Quarter-by-quarter capital appreciation trajectory and the authentic properties behind every benchmark.</p>
                </div>
                <div class="dohra-banner-stats">
                    <div class="dohra-stat-pill">
                        <span class="label">1-Year Capital Growth</span>
                        <strong class="val" style="color:#0e9f6e;">+18.1% (₹3.6K → ₹4.25K)</strong>
                    </div>
                    <div class="dohra-stat-pill">
                        <span class="label">Benchmark Period</span>
                        <strong class="val">Q4 '25 to Q3 '26</strong>
                    </div>
                    <div class="dohra-stat-pill">
                        <span class="label">Recorded Turnover</span>
                        <strong class="val" style="color:#854d0e;">645+ Deals (₹340+ Cr)</strong>
                    </div>
                </div>
            </div>

            <!-- Interactive Quarter Selector Cards & Visual Trendline -->
            <div class="dohra-visual-widget">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <div>
                        <strong style="font-size:14px;color:#1e293b;">Quarterly Price Indices & Growth Rate</strong>
                        <span style="font-size:12px;color:#64748b;margin-left:8px;">(Click any quarter to inspect its transacted properties)</span>
                    </div>
                    <button type="button" class="dohra-reset-btn" onclick="filterTrendQuarter('all')" style="height:30px;padding:0 10px;font-size:11px;">
                        All Quarters
                    </button>
                </div>

                <div class="dohra-trend-cards">
                    ${TREND_QUARTERS.map(function (q) {
                        var isAct = state.quarterFilter === q.quarter;
                        return `
                            <div class="dohra-quarter-card ${isAct ? 'active' : ''}" onclick="filterTrendQuarter('${q.quarter}')">
                                <div class="q-title">${q.quarter}</div>
                                <div style="font-size:11px;color:#64748b;margin-bottom:4px;">${q.period}</div>
                                <div class="q-rate">₹ ${q.rate.toLocaleString()} <span style="font-size:11px;font-weight:400;color:#64748b;">/sq.ft</span></div>
                                <span class="q-gain">${q.growth}</span>
                                <div style="font-size:11px;color:#64748b;margin-top:6px;">${q.transactions} deals • ${q.volumeCr}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Toolbar Controls -->
            ${renderToolbar('trend')}

            <!-- Table / Mobile Cards -->
            <div id="dohraDataTableContainer"></div>
        `;

        container.innerHTML = html;
        renderTrendTable();
    }

    window.filterTrendQuarter = function (qtr) {
        state.quarterFilter = qtr;
        state.currentPage = 1;
        renderActiveView();
    };

    function renderTrendTable() {
        var target = document.getElementById('dohraDataTableContainer');
        if (!target) return;

        var list = TREND_BENCHMARKS.slice();

        // 1. Quarter Filter
        if (state.quarterFilter && state.quarterFilter !== 'all') {
            list = list.filter(function (b) {
                return b.quarter === state.quarterFilter;
            });
        }

        // 2. Search
        if (state.searchTerm) {
            list = list.filter(function (b) {
                return matchesSearch(b, state.searchTerm);
            });
        }

        // 3. Property Type
        if (state.propertyTypeFilter && state.propertyTypeFilter !== 'all') {
            list = list.filter(function (b) {
                return b.type.toLowerCase() === state.propertyTypeFilter.toLowerCase();
            });
        }

        // 4. Sort
        applySorting(list);

        if (list.length === 0) {
            target.innerHTML = renderEmptyState();
            return;
        }

        var total = list.length;
        var totalPages = Math.ceil(total / state.itemsPerPage);
        if (state.currentPage > totalPages) state.currentPage = totalPages;
        var startIdx = (state.currentPage - 1) * state.itemsPerPage;
        var paginated = list.slice(startIdx, startIdx + state.itemsPerPage);

        var tableHtml = `
            <div class="dohra-table-wrap">
                <table class="dohra-table">
                    <thead>
                        <tr>
                            <th>Quarter & Date</th>
                            <th>Property / Society</th>
                            <th>Unit Type & Area</th>
                            <th>Transacted Rate</th>
                            <th>Total Value</th>
                            <th>Quarterly Movement</th>
                            <th>Registry Benchmark Source</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginated.map(function (b) {
                            return `
                                <tr>
                                    <td>
                                        <span class="badge-tag badge-amber" style="font-size:12px;">${b.quarter}</span>
                                        <div style="font-size:11.5px;color:#64748b;margin-top:4px;">${b.date}</div>
                                    </td>
                                    <td>
                                        <strong>${b.property}</strong>
                                        <div style="font-size:11.5px;color:#64748b;">Dohra Road Sector</div>
                                    </td>
                                    <td>
                                        <strong>${b.type}</strong>
                                        <div style="font-size:11.5px;color:#64748b;">${b.area.toLocaleString()} sq.ft</div>
                                    </td>
                                    <td>
                                        <div class="rate-cell">₹ ${b.rate.toLocaleString()} /sq.ft</div>
                                    </td>
                                    <td>
                                        <div class="total-cell">${b.totalPrice}</div>
                                    </td>
                                    <td>
                                        <span class="badge-tag badge-green">${b.movement}</span>
                                    </td>
                                    <td>
                                        <span style="font-size:11.5px;color:#475569;display:block;">${b.benchmarkSource}</span>
                                        <span style="font-size:10.5px;color:#0e9f6e;">✔ Verified Benchmark</span>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Mobile Card View -->
            <div class="dohra-mobile-cards">
                ${paginated.map(function (b) {
                    return `
                        <div class="dohra-m-card">
                            <div class="dohra-m-card-header">
                                <div>
                                    <strong style="font-size:15px;color:#0f172a;display:block;">${b.property}</strong>
                                    <span style="font-size:12px;color:#64748b;">Recorded: ${b.date}</span>
                                </div>
                                <span class="badge-tag badge-amber">${b.quarter}</span>
                            </div>
                            <div class="dohra-m-card-rates">
                                <div>
                                    <span style="font-size:11px;color:#64748b;display:block;">Benchmark Rate</span>
                                    <strong style="font-size:16px;color:#854d0e;">₹ ${b.rate.toLocaleString()}/sq.ft</strong>
                                </div>
                                <div style="text-align:right;">
                                    <span style="font-size:11px;color:#64748b;display:block;">Transacted Total</span>
                                    <strong style="font-size:16px;color:#0f172a;">${b.totalPrice}</strong>
                                </div>
                            </div>
                            <div class="dohra-m-card-meta">
                                <span>📐 ${b.type} (${b.area.toLocaleString()} sq.ft)</span>
                                <span>📊 ${b.movement}</span>
                            </div>
                            <div style="margin-top:10px;font-size:11px;color:#475569;background:#f8fafc;padding:6px 10px;border-radius:6px;border:1px solid #edf2f7;">
                                📜 ${b.benchmarkSource}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Pagination Bar -->
            ${renderPagination(startIdx + 1, Math.min(startIdx + state.itemsPerPage, total), total, totalPages)}
        `;

        target.innerHTML = tableHtml;
    }

    // -------------------------------------------------------------
    // VIEW 3: ASKING PRICE (1,420+ VERIFIED LISTINGS)
    // -------------------------------------------------------------
    function renderListingsView(container) {
        var brackets = [
            { id: "all", label: "All Listings", count: "1,420+", desc: "Full Dohra Catalog" },
            { id: "<2.5K", label: "< 2.5K", count: "140", desc: "Peripheral Plots" },
            { id: "3K", label: "3K (₹2.5K-3.5K)", count: "320", desc: "Plots & Low-Rise" },
            { id: "4K", label: "4K (₹3.5K-4.5K)", count: "580", desc: "Peak Demand (Villas)" },
            { id: "5K", label: "5K (₹4.5K-5.5K)", count: "260", desc: "Luxury Residences" },
            { id: "6.5K", label: "6.5K (₹5.5K-6.5K)", count: "90", desc: "Boutique / Semi-Comm" },
            { id: "7K+", label: "7K+ (₹6.5K+)", count: "30", desc: "Prime Commercial" }
        ];

        var html = `
            <!-- Top Banner -->
            <div class="dohra-view-banner listings-banner">
                <div class="dohra-banner-title">
                    <h3>📋 1,420+ Active Verified Listings on Dohra Road</h3>
                    <p>Direct buyer-to-seller asking rates, verified inventory, and price distribution across 6 price brackets.</p>
                </div>
                <div class="dohra-banner-stats">
                    <div class="dohra-stat-pill">
                        <span class="label">Median Asking Rate</span>
                        <strong class="val" style="color:#ea580c;">₹ 3.85 K /sq.ft</strong>
                    </div>
                    <div class="dohra-stat-pill">
                        <span class="label">Total Active Listings</span>
                        <strong class="val">1,420+ Properties</strong>
                    </div>
                    <div class="dohra-stat-pill">
                        <span class="label">Core Demand Cluster</span>
                        <strong class="val" style="color:#b45309;">4K Bracket (580 Units)</strong>
                    </div>
                </div>
            </div>

            <!-- Price Range Filter Pills (<2.5K, 3K, 4K, 5K, 6.5K, 7K+) -->
            <div class="dohra-visual-widget">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <div>
                        <strong style="font-size:14px;color:#1e293b;">Filter By Asking Price Range</strong>
                        <span style="font-size:12px;color:#64748b;margin-left:8px;">(Exact bracket counts from Dohra Road market survey)</span>
                    </div>
                    <span style="font-size:11.5px;color:#ea580c;font-weight:700;">★ 100% Skyyards Document Verified</span>
                </div>

                <div class="dohra-brackets-bar">
                    ${brackets.map(function (b) {
                        var isAct = state.priceBracketFilter === b.id;
                        return `
                            <button type="button" class="dohra-bracket-btn ${isAct ? 'active' : ''}" onclick="filterPriceBracket('${b.id}')">
                                <span>${b.label}</span>
                                <span class="b-count">${b.count}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Toolbar Controls -->
            ${renderToolbar('listings')}

            <!-- Table / Mobile Cards -->
            <div id="dohraDataTableContainer"></div>
        `;

        container.innerHTML = html;
        renderListingsTable();
    }

    window.filterPriceBracket = function (bId) {
        state.priceBracketFilter = bId;
        state.currentPage = 1;
        renderActiveView();
    };

    function renderListingsTable() {
        var target = document.getElementById('dohraDataTableContainer');
        if (!target) return;

        var list = HEATMAP_PROPERTIES.slice();

        // 1. Bracket Filter
        if (state.priceBracketFilter && state.priceBracketFilter !== 'all') {
            list = list.filter(function (p) {
                return p.bracket === state.priceBracketFilter;
            });
        }

        // 2. Search
        if (state.searchTerm) {
            list = list.filter(function (p) {
                return matchesSearch(p, state.searchTerm);
            });
        }

        // 3. Property Type
        if (state.propertyTypeFilter && state.propertyTypeFilter !== 'all') {
            list = list.filter(function (p) {
                return p.type.toLowerCase() === state.propertyTypeFilter.toLowerCase();
            });
        }

        // 4. Sort
        applySorting(list);

        if (list.length === 0) {
            target.innerHTML = renderEmptyState();
            return;
        }

        var total = list.length;
        var totalPages = Math.ceil(total / state.itemsPerPage);
        if (state.currentPage > totalPages) state.currentPage = totalPages;
        var startIdx = (state.currentPage - 1) * state.itemsPerPage;
        var paginated = list.slice(startIdx, startIdx + state.itemsPerPage);

        var tableHtml = `
            <div class="dohra-table-wrap">
                <table class="dohra-table">
                    <thead>
                        <tr>
                            <th>Verified Listing Title</th>
                            <th>Price Range Bracket</th>
                            <th>Configuration</th>
                            <th>Asking Rate</th>
                            <th>Total Asking Price</th>
                            <th>Verification Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginated.map(function (p) {
                            return `
                                <tr>
                                    <td>
                                        <div class="prop-title-cell">
                                            <strong>${p.name}</strong>
                                            <span class="loc"><em class="icon-pin-locality"></em> ${p.location}</span>
                                        </div>
                                    </td>
                                    <td><span class="badge-tag badge-amber">${p.bracket} Range</span></td>
                                    <td>
                                        <strong>${p.bhk}</strong>
                                        <div style="font-size:12px;color:#64748b;">${p.area.toLocaleString()} sq.ft</div>
                                    </td>
                                    <td>
                                        <div class="rate-cell" style="color:#c2410c;">₹ ${p.rate.toLocaleString()} /sq.ft</div>
                                    </td>
                                    <td>
                                        <div class="total-cell">${p.totalPrice}</div>
                                    </td>
                                    <td>
                                        <span class="badge-tag badge-green">✔ Verified Active</span>
                                        <div style="font-size:11px;color:#64748b;margin-top:3px;">${p.approval}</div>
                                    </td>
                                    <td>
                                        <a href="contact-us.html" class="btn" style="height:32px;padding:0 12px;background:#ffd916;color:#1e293b;font-size:12px;font-weight:700;border-radius:6px;display:inline-flex;align-items:center;">
                                            Enquire
                                        </a>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Mobile Card View -->
            <div class="dohra-mobile-cards">
                ${paginated.map(function (p) {
                    return `
                        <div class="dohra-m-card">
                            <div class="dohra-m-card-header">
                                <div>
                                    <strong style="font-size:15px;color:#0f172a;display:block;">${p.name}</strong>
                                    <span style="font-size:12px;color:#64748b;">${p.location}</span>
                                </div>
                                <span class="badge-tag badge-amber">${p.bracket}</span>
                            </div>
                            <div class="dohra-m-card-rates">
                                <div>
                                    <span style="font-size:11px;color:#64748b;display:block;">Asking Rate</span>
                                    <strong style="font-size:16px;color:#c2410c;">₹ ${p.rate.toLocaleString()}/sq.ft</strong>
                                </div>
                                <div style="text-align:right;">
                                    <span style="font-size:11px;color:#64748b;display:block;">Total Asking</span>
                                    <strong style="font-size:16px;color:#0f172a;">${p.totalPrice}</strong>
                                </div>
                            </div>
                            <div class="dohra-m-card-meta">
                                <span>📐 ${p.bhk} (${p.area.toLocaleString()} sq.ft)</span>
                                <span>🏷️ ${p.approval}</span>
                            </div>
                            <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;">
                                <span style="font-size:11px;color:#0e9f6e;font-weight:600;">✔ 100% Verified Listing</span>
                                <a href="contact-us.html" class="btn" style="height:34px;padding:0 14px;background:#ffd916;color:#1e293b;font-size:12px;font-weight:700;border-radius:6px;display:inline-flex;align-items:center;">
                                    Enquire Now
                                </a>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Pagination Bar -->
            ${renderPagination(startIdx + 1, Math.min(startIdx + state.itemsPerPage, total), total, totalPages)}
        `;

        target.innerHTML = tableHtml;
    }

    // -------------------------------------------------------------
    // VIEW 4: GOVT. REGISTRATIONS (OFFICIAL DEAL INSIGHTS)
    // -------------------------------------------------------------
    function renderDealsView(container) {
        var html = `
            <!-- Top Banner -->
            <div class="dohra-view-banner deals-banner">
                <div class="dohra-banner-title">
                    <h3>🏛️ Official Govt. Registered Deals & Stamp Insights</h3>
                    <p>Official IGRSUP Bareilly stamp registry transactions, registered considerations, and deed benchmarks.</p>
                </div>
                <div class="dohra-banner-stats">
                    <div class="dohra-stat-pill">
                        <span class="label">Total Registered Deals</span>
                        <strong class="val" style="color:#9d174d;">14,820 Deeds</strong>
                    </div>
                    <div class="dohra-stat-pill">
                        <span class="label">Gross Registered Value</span>
                        <strong class="val">₹ 3,485 Cr</strong>
                    </div>
                    <div class="dohra-stat-pill">
                        <span class="label">Avg. Registry Benchmark</span>
                        <strong class="val" style="color:#0284c7;">₹ 3,450 /sq.ft</strong>
                    </div>
                </div>
            </div>

            <!-- Registry Department Authentication Info -->
            <div class="dohra-visual-widget" style="padding:16px 20px;">
                <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div style="width:40px;height:40px;border-radius:8px;background:#fce7f3;display:flex;align-items:center;justify-content:center;color:#db2777;font-size:20px;">
                            🏛️
                        </div>
                        <div>
                            <strong style="font-size:14px;color:#1e293b;display:block;">Government of Uttar Pradesh — Stamp & Registration Department</strong>
                            <span style="font-size:12px;color:#64748b;">Sub-Registrar Offices I & II, Bareilly • Circle Rate vs Market Registry Ratio</span>
                        </div>
                    </div>
                    <span style="font-size:11.5px;color:#be185d;font-weight:700;background:#fce7f3;padding:4px 10px;border-radius:6px;">
                        Official Stamp Records
                    </span>
                </div>
            </div>

            <!-- Toolbar Controls -->
            ${renderToolbar('deals')}

            <!-- Table / Mobile Cards -->
            <div id="dohraDataTableContainer"></div>
        `;

        container.innerHTML = html;
        renderDealsTable();
    }

    function renderDealsTable() {
        var target = document.getElementById('dohraDataTableContainer');
        if (!target) return;

        var list = GOVT_DEALS.slice();

        // 1. Search filter
        if (state.searchTerm) {
            list = list.filter(function (d) {
                return matchesSearch(d, state.searchTerm);
            });
        }

        // 2. Property Type filter
        if (state.propertyTypeFilter && state.propertyTypeFilter !== 'all') {
            list = list.filter(function (d) {
                return d.type.toLowerCase().includes(state.propertyTypeFilter.toLowerCase());
            });
        }

        // 3. Sort
        if (state.sortBy === 'rate_asc') {
            list.sort(function (a, b) { return a.registeredRate - b.registeredRate; });
        } else if (state.sortBy === 'rate_desc') {
            list.sort(function (a, b) { return b.registeredRate - a.registeredRate; });
        } else if (state.sortBy === 'price_asc') {
            list.sort(function (a, b) { return a.grossValNum - b.grossValNum; });
        } else if (state.sortBy === 'price_desc') {
            list.sort(function (a, b) { return b.grossValNum - a.grossValNum; });
        }

        if (list.length === 0) {
            target.innerHTML = renderEmptyState();
            return;
        }

        var total = list.length;
        var totalPages = Math.ceil(total / state.itemsPerPage);
        if (state.currentPage > totalPages) state.currentPage = totalPages;
        var startIdx = (state.currentPage - 1) * state.itemsPerPage;
        var paginated = list.slice(startIdx, startIdx + state.itemsPerPage);

        var tableHtml = `
            <div class="dohra-table-wrap">
                <table class="dohra-table">
                    <thead>
                        <tr>
                            <th>Sale Deed Details</th>
                            <th>Property Description</th>
                            <th>Registered Area</th>
                            <th>Gross Value</th>
                            <th>Registered Rate</th>
                            <th>Stamp Duty Paid</th>
                            <th>Circle Rate vs Market</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paginated.map(function (d) {
                            return `
                                <tr>
                                    <td>
                                        <strong style="color:#0f172a;font-family:monospace;font-size:12.5px;">${d.deedNo}</strong>
                                        <div style="font-size:11.5px;color:#64748b;margin-top:2px;">Reg. Date: ${d.date}</div>
                                        <div style="font-size:11px;color:#94a3b8;">${d.sro}</div>
                                    </td>
                                    <td>
                                        <div class="prop-title-cell">
                                            <strong>${d.property}</strong>
                                            <span class="loc">${d.location}</span>
                                            <span class="badge-tag badge-purple" style="width:fit-content;margin-top:4px;">${d.type}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <strong>${d.areaSqft.toLocaleString()} sq.ft</strong>
                                        <div style="font-size:11px;color:#64748b;">(${d.areaSqm} sq.m)</div>
                                    </td>
                                    <td>
                                        <div class="total-cell" style="color:#9d174d;">${d.grossValue}</div>
                                    </td>
                                    <td>
                                        <div class="rate-cell" style="color:#0f172a;">₹ ${d.registeredRate.toLocaleString()} /sq.ft</div>
                                    </td>
                                    <td>
                                        <div style="font-size:12.5px;font-weight:700;color:#0e9f6e;">${d.stampDuty}</div>
                                        <div style="font-size:11px;color:#64748b;">Reg Fee: ${d.regFee}</div>
                                    </td>
                                    <td>
                                        <span class="badge-tag badge-green">${d.marketPremium}</span>
                                        <div style="font-size:11px;color:#64748b;margin-top:3px;">Circle: ${d.circleRate}</div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Mobile Card View -->
            <div class="dohra-mobile-cards">
                ${paginated.map(function (d) {
                    return `
                        <div class="dohra-m-card">
                            <div class="dohra-m-card-header">
                                <div>
                                    <strong style="font-size:15px;color:#0f172a;display:block;">${d.property}</strong>
                                    <span style="font-size:11.5px;color:#64748b;font-family:monospace;">${d.deedNo}</span>
                                </div>
                                <span class="badge-tag badge-purple">${d.type}</span>
                            </div>
                            <div class="dohra-m-card-rates">
                                <div>
                                    <span style="font-size:11px;color:#64748b;display:block;">Registered Rate</span>
                                    <strong style="font-size:16px;color:#0f172a;">₹ ${d.registeredRate.toLocaleString()}/sq.ft</strong>
                                </div>
                                <div style="text-align:right;">
                                    <span style="font-size:11px;color:#64748b;display:block;">Gross Registered Value</span>
                                    <strong style="font-size:16px;color:#9d174d;">${d.grossValue}</strong>
                                </div>
                            </div>
                            <div class="dohra-m-card-meta">
                                <span>📅 Date: ${d.date}</span>
                                <span>📐 ${d.areaSqft.toLocaleString()} sq.ft (${d.areaSqm} sq.m)</span>
                                <span>🏛️ ${d.sro}</span>
                            </div>
                            <div style="margin-top:10px;padding:8px 10px;background:#fdf2f8;border-radius:6px;border:1px solid #fbcfe8;font-size:11.5px;">
                                <strong>Stamp Duty:</strong> ${d.stampDuty} &nbsp;|&nbsp; <strong>Circle Rate:</strong> ${d.circleRate} <span style="color:#0e9f6e;font-weight:700;">(${d.marketPremium})</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Pagination Bar -->
            ${renderPagination(startIdx + 1, Math.min(startIdx + state.itemsPerPage, total), total, totalPages)}
        `;

        target.innerHTML = tableHtml;
    }

    // -------------------------------------------------------------
    // 5. TOOLBAR, FILTERING, SORTING & PAGINATION HELPERS
    // -------------------------------------------------------------
    function renderToolbar(viewMode) {
        return `
            <div class="dohra-toolbar">
                <!-- Search Input -->
                <div class="dohra-search-box">
                    <span class="icon-search">🔍</span>
                    <input type="text" placeholder="Search property, project, or landmark..." value="${state.searchTerm}" oninput="handleDohraSearch(this.value)">
                </div>

                <!-- Filters -->
                <div class="dohra-filters">
                    <select class="dohra-filter-select" onchange="handleDohraTypeFilter(this.value)">
                        <option value="all" ${state.propertyTypeFilter === 'all' ? 'selected' : ''}>All Property Types</option>
                        <option value="villa" ${state.propertyTypeFilter === 'villa' ? 'selected' : ''}>Duplex Villas</option>
                        <option value="plot" ${state.propertyTypeFilter === 'plot' ? 'selected' : ''}>Residential Plots</option>
                        <option value="commercial" ${state.propertyTypeFilter === 'commercial' ? 'selected' : ''}>Commercial Spaces</option>
                        <option value="apartment" ${state.propertyTypeFilter === 'apartment' ? 'selected' : ''}>Apartments & Floors</option>
                    </select>

                    <select class="dohra-filter-select" onchange="handleDohraSort(this.value)">
                        <option value="rate_desc" ${state.sortBy === 'rate_desc' ? 'selected' : ''}>Rate: High to Low</option>
                        <option value="rate_asc" ${state.sortBy === 'rate_asc' ? 'selected' : ''}>Rate: Low to High</option>
                        <option value="price_desc" ${state.sortBy === 'price_desc' ? 'selected' : ''}>Total Price: High to Low</option>
                        <option value="price_asc" ${state.sortBy === 'price_asc' ? 'selected' : ''}>Total Price: Low to High</option>
                        <option value="name_asc" ${state.sortBy === 'name_asc' ? 'selected' : ''}>Property Name (A-Z)</option>
                    </select>

                    <button type="button" class="dohra-reset-btn" onclick="resetDohraFilters()">
                        Reset Filters
                    </button>
                </div>
            </div>
        `;
    }

    function renderPagination(start, end, total, totalPages) {
        var pageBtns = [];
        for (var i = 1; i <= totalPages; i++) {
            pageBtns.push(`
                <button type="button" class="dohra-page-btn ${state.currentPage === i ? 'active' : ''}" onclick="goToDohraPage(${i})">
                    ${i}
                </button>
            `);
        }

        return `
            <div class="dohra-pagination">
                <div class="dohra-page-info">
                    Showing <strong>${start}</strong> to <strong>${end}</strong> of <strong>${total}</strong> records
                </div>
                <div class="dohra-page-controls">
                    <button type="button" class="dohra-page-btn" ${state.currentPage === 1 ? 'disabled' : ''} onclick="goToDohraPage(${state.currentPage - 1})">
                        Prev
                    </button>
                    ${pageBtns.join('')}
                    <button type="button" class="dohra-page-btn" ${state.currentPage === totalPages ? 'disabled' : ''} onclick="goToDohraPage(${state.currentPage + 1})">
                        Next
                    </button>
                </div>
            </div>
        `;
    }

    function renderEmptyState() {
        return `
            <div class="dohra-empty-state">
                <div class="empty-icon">🔎</div>
                <h4>No properties found</h4>
                <p>No records matched your current filter or search term. Try adjusting your query or resetting all filters.</p>
                <button type="button" class="btn dohra-reset-btn" onclick="resetDohraFilters()" style="height:38px;padding:0 20px;font-weight:700;">
                    Reset All Filters
                </button>
            </div>
        `;
    }

    function applySorting(list) {
        if (state.sortBy === 'rate_asc') {
            list.sort(function (a, b) { return a.rate - b.rate; });
        } else if (state.sortBy === 'rate_desc') {
            list.sort(function (a, b) { return b.rate - a.rate; });
        } else if (state.sortBy === 'price_asc') {
            list.sort(function (a, b) { return a.totalVal - b.totalVal; });
        } else if (state.sortBy === 'price_desc') {
            list.sort(function (a, b) { return b.totalVal - a.totalVal; });
        } else if (state.sortBy === 'name_asc') {
            list.sort(function (a, b) {
                var nameA = (a.name || a.property || '').toLowerCase();
                var nameB = (b.name || b.property || '').toLowerCase();
                return nameA.localeCompare(nameB);
            });
        }
    }

    // Event Handlers
    window.handleDohraSearch = function (val) {
        state.searchTerm = val;
        state.currentPage = 1;
        updateActiveTableOnly();
    };

    window.handleDohraTypeFilter = function (val) {
        state.propertyTypeFilter = val;
        state.currentPage = 1;
        updateActiveTableOnly();
    };

    window.handleDohraSort = function (val) {
        state.sortBy = val;
        state.currentPage = 1;
        updateActiveTableOnly();
    };

    window.resetDohraFilters = function () {
        state.searchTerm = '';
        state.propertyTypeFilter = 'all';
        state.subZoneFilter = 'all';
        state.priceBracketFilter = 'all';
        state.quarterFilter = 'all';
        state.sortBy = 'rate_desc';
        state.currentPage = 1;
        renderActiveView();
    };

    window.goToDohraPage = function (pageNum) {
        state.currentPage = pageNum;
        updateActiveTableOnly();
        var target = document.getElementById('dohraDataTableContainer');
        if (target) {
            var rect = target.getBoundingClientRect();
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            window.scrollTo({ top: rect.top + scrollTop - 100, behavior: 'smooth' });
        }
    };

    function updateActiveTableOnly() {
        if (state.activeView === 'heatmap') renderHeatmapTable();
        else if (state.activeView === 'trend') renderTrendTable();
        else if (state.activeView === 'listings') renderListingsTable();
        else if (state.activeView === 'deals') renderDealsTable();
    }

    // Auto-initialize if URL hash specifies an insight view
    document.addEventListener('DOMContentLoaded', function () {
        var hash = window.location.hash;
        if (hash === '#explore-rates' || hash === '#rates-heatmap') {
            openDohraInsightView('heatmap');
        } else if (hash === '#price-trend' || hash === '#price-history') {
            openDohraInsightView('trend');
        } else if (hash === '#verified-listings' || hash === '#asking-price') {
            openDohraInsightView('listings');
        } else if (hash === '#deal-insights' || hash === '#govt-registrations') {
            openDohraInsightView('deals');
        }
    });

})();
