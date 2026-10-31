const fs = require('fs');
const path = require('path');

// Let's create the complete, high-fidelity Skyyards Bareilly HTML
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Skyyards Bareilly | Real Estate, Buy/Rent Duplex Villas, Plots, Flats in Bareilly</title>
  <meta name="description" content="Skyyards Bareilly - Bareilly's Premier Real Estate Consulting Platform. Discover BDA & RERA approved 3BHK duplex villas, residential plots & townships in Dohra Road, Bada Bypass, Nainital Road & Greater Bareilly.">
  <meta name="keywords" content="Skyyards Bareilly, Sky Yards Bareilly, Real Estate Bareilly, Kings Crest Dohra Road, Olive Homes Bareilly, JHM Desire, JHM Joy, Eldeco City Bareilly, BDA Approved Plots Bareilly, Duplex Villas Bareilly">
  <meta name="theme-color" content="#d92228">
  <link rel="icon" type="image/png" href="assets/images/skyyards-logo.png">

  <!-- Google Fonts: Inter & Poppins -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="fonts.googleapis.com/css2.css" rel="stylesheet">

  <!-- Core Square Yards Stylesheets (Local Clones) -->
  <link rel="stylesheet" href="assets/fonts/projectV2/moonicon-158cf97e06.min.css">
  <link rel="stylesheet" href="assets/css/critical-home.css">
  <link rel="stylesheet" href="assets/css/common_second_fold-8663ca8305.min.css">
  <link rel="stylesheet" href="assets/css/home-v2-3d4d9f9b96.min.css">
  <link rel="stylesheet" href="assets/css/loginpopup-common-45dbf9c39c.min.css">
  <link rel="stylesheet" href="assets/css/qr_code.css">

  <style>
    /* Custom Skyyards Bareilly Design Enhancements & Functional Styles */
    :root {
      --primary: #d92228;
      --primary-hover: #b9151b;
      --secondary: #1e3a8a;
      --accent: #f59e0b;
      --dark: #1e293b;
      --light-bg: #f8fafc;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
      overflow-x: hidden;
    }

    /* Header & Brand Enhancements */
    header.outer {
      background: #ffffff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 24px;
      height: 72px;
      box-sizing: border-box;
    }
    .logoBox {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }
    .logoBox img {
      max-height: 48px;
      width: auto;
      object-fit: contain;
    }
    .logoText {
      display: flex;
      flex-direction: column;
    }
    .logoText .brandName {
      font-family: 'Poppins', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #1e293b;
      line-height: 1.1;
      letter-spacing: -0.5px;
    }
    .logoText .brandName span {
      color: var(--primary);
    }
    .logoText .brandTag {
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .citySelectorBtn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      transition: all 0.2s;
    }
    .citySelectorBtn:hover {
      background: #e2e8f0;
      color: var(--primary);
    }
    .citySelectorBtn .cityDot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
    }

    nav .desktopNav ul.navItem {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 22px;
    }
    nav .desktopNav ul.navItem li {
      position: relative;
    }
    nav .desktopNav ul.navItem li a,
    nav .desktopNav ul.navItem li span.megaDropDownItem {
      font-size: 14px;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      text-decoration: none;
      padding: 8px 4px;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: color 0.2s;
    }
    nav .desktopNav ul.navItem li:hover > a,
    nav .desktopNav ul.navItem li:hover > span.megaDropDownItem {
      color: var(--primary);
    }

    /* Dropdown Menus */
    .navDropdown {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background: #ffffff;
      min-width: 240px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.12);
      border-radius: 8px;
      padding: 10px 0;
      z-index: 1001;
      border: 1px solid #f1f5f9;
    }
    nav .desktopNav ul.navItem li:hover .navDropdown {
      display: block;
    }
    .navDropdown a {
      display: block !important;
      padding: 8px 18px !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      color: #475569 !important;
      text-decoration: none !important;
      transition: all 0.2s !important;
    }
    .navDropdown a:hover {
      background: #fef2f2 !important;
      color: var(--primary) !important;
      padding-left: 22px !important;
    }

    .headerRightSide {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .headerCallBtn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #fef2f2;
      color: var(--primary);
      border: 1px solid #fecaca;
      border-radius: 20px;
      padding: 7px 16px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
    }
    .headerCallBtn:hover {
      background: var(--primary);
      color: #fff;
    }
    .headerRightSide .loginBtn {
      background: var(--primary);
      color: #fff;
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: background 0.2s;
    }
    .headerRightSide .loginBtn:hover {
      background: var(--primary-hover);
    }

    /* Hero Search Custom Styling */
    .home-search {
      position: relative;
      background: #111827;
      min-height: 540px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .home-search .hero-banner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.35;
    }
    .home-search .heroContent {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 1180px;
      margin: 0 auto;
      padding: 40px 20px;
      text-align: center;
    }
    .heroRatingBadge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      padding: 6px 16px;
      border-radius: 30px;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .heroRatingBadge .stars {
      color: #fbbf24;
    }
    .home-search h1 {
      font-family: 'Poppins', sans-serif;
      font-size: 44px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.15;
      margin: 0 0 12px 0;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }
    .home-search h1 span {
      color: #fca5a5;
    }
    .heroSubhead {
      font-size: 18px;
      color: #e2e8f0;
      margin-bottom: 28px;
      font-weight: 500;
    }
    .heroTickerBox {
      display: inline-block;
      background: rgba(0, 0, 0, 0.4);
      padding: 4px 14px;
      border-radius: 20px;
      color: #fde047;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 24px;
    }

    /* Main Search Container */
    .searchBoxWrapper {
      background: #ffffff;
      border-radius: 16px;
      padding: 8px 12px;
      box-shadow: 0 20px 45px rgba(0,0,0,0.25);
      max-width: 960px;
      margin: 0 auto;
      text-align: left;
    }
    .searchTabs {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid #f1f5f9;
      padding: 6px 12px 10px 12px;
      overflow-x: auto;
    }
    .searchTabItem {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      user-select: none;
    }
    .searchTabItem.active {
      background: var(--primary);
      color: #ffffff;
    }
    .searchControlsGrid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 12px;
      padding: 12px;
      align-items: center;
      position: relative;
    }
    @media (max-width: 860px) {
      .searchControlsGrid {
        grid-template-columns: 1fr;
      }
    }
    .searchInputWrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 4px 12px;
    }
    .searchInputWrapper em {
      font-size: 18px;
      color: #94a3b8;
      margin-right: 8px;
    }
    .searchInputWrapper input {
      width: 100%;
      border: none;
      background: transparent;
      padding: 10px 0;
      font-size: 14px;
      outline: none;
      font-family: inherit;
      color: #1e293b;
    }
    .searchSelectWrapper select {
      width: 100%;
      padding: 12px 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      font-size: 13px;
      color: #334155;
      font-family: inherit;
      outline: none;
      cursor: pointer;
    }
    .searchActionBtn {
      background: var(--primary);
      color: #ffffff;
      border: none;
      border-radius: 10px;
      padding: 13px 26px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.2s;
      white-space: nowrap;
    }
    .searchActionBtn:hover {
      background: var(--primary-hover);
    }

    /* Live Search Suggestions Dropdown */
    .searchSuggestionsBox {
      display: none;
      position: absolute;
      top: 100%;
      left: 12px;
      right: 12px;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 15px 30px rgba(0,0,0,0.15);
      border: 1px solid #e2e8f0;
      z-index: 1005;
      max-height: 320px;
      overflow-y: auto;
      margin-top: 6px;
    }
    .suggestionGroupTitle {
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 10px 16px 4px 16px;
      background: #f8fafc;
    }
    .suggestionItem {
      padding: 10px 16px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.15s;
    }
    .suggestionItem:hover {
      background: #fef2f2;
    }
    .suggestionItem .sugName {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
    }
    .suggestionItem .sugType {
      font-size: 11px;
      background: #e2e8f0;
      color: #475569;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 600;
    }

    .heroQuickTags {
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 12px;
      color: #cbd5e1;
    }
    .heroQuickTags a {
      background: rgba(255, 255, 255, 0.18);
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 20px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.2s;
    }
    .heroQuickTags a:hover {
      background: var(--primary);
    }

    /* Section Headers */
    .sectionContainer {
      max-width: 1240px;
      margin: 0 auto;
      padding: 45px 20px;
    }
    .title-box {
      margin-bottom: 26px;
    }
    .title-box .title, .title-box h2 {
      font-family: 'Poppins', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: #1e293b;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }
    .title-box .description {
      font-size: 15px;
      color: #64748b;
      margin: 0;
      max-width: 800px;
      line-height: 1.5;
    }

    /* Filter Tabs in Sections */
    .sectionFilterTabs {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      margin-bottom: 24px;
      padding-bottom: 6px;
    }
    .sectionFilterTab {
      padding: 8px 20px;
      border-radius: 25px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      font-size: 13px;
      font-weight: 700;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .sectionFilterTab:hover, .sectionFilterTab.active {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
    }

    /* Project Cards Grid */
    .projectsGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 24px;
    }
    @media (max-width: 480px) {
      .projectsGrid {
        grid-template-columns: 1fr;
      }
    }

    .projectCard {
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1px solid #f1f5f9;
      transition: transform 0.25s, box-shadow 0.25s;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .projectCard:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 35px rgba(0,0,0,0.12);
    }
    .projectCardImageWrapper {
      position: relative;
      height: 220px;
      overflow: hidden;
      background: #e2e8f0;
    }
    .projectCardImageWrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }
    .projectCard:hover .projectCardImageWrapper img {
      transform: scale(1.05);
    }
    .projectBadges {
      position: absolute;
      top: 14px;
      left: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      z-index: 2;
    }
    .badgeApproved {
      background: #16a34a;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    .badgeHot {
      background: var(--primary);
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    .favBtn {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      font-size: 18px;
      transition: all 0.2s;
      border: none;
      z-index: 2;
    }
    .favBtn:hover, .favBtn.active {
      color: var(--primary);
      background: #ffffff;
      transform: scale(1.1);
    }

    .projectCardBody {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .projectBuilderName {
      font-size: 12px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .projectName {
      font-family: 'Poppins', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 6px 0;
    }
    .projectLocation {
      font-size: 13px;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 12px;
    }
    .projectPriceRow {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      border-top: 1px dashed #e2e8f0;
      border-bottom: 1px dashed #e2e8f0;
      padding: 10px 0;
      margin-bottom: 14px;
    }
    .priceTag {
      font-size: 20px;
      font-weight: 800;
      color: var(--primary);
    }
    .configTag {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
    }
    .amenitiesTags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 18px;
    }
    .amenityItem {
      font-size: 11px;
      font-weight: 600;
      color: #475569;
      background: #f1f5f9;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .projectLoanTag {
      font-size: 11.5px;
      color: #0369a1;
      background: #e0f2fe;
      padding: 6px 10px;
      border-radius: 6px;
      font-weight: 600;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .projectCardActions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: auto;
    }
    .btnEnquire {
      background: var(--primary);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 10px 0;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      transition: background 0.2s;
    }
    .btnEnquire:hover {
      background: var(--primary-hover);
    }
    .btnDetails {
      background: #f8fafc;
      color: #334155;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 0;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    .btnDetails:hover {
      background: #e2e8f0;
      color: var(--primary);
    }

    /* Recommendation Reels Section */
    .reelsScrollWrapper {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding: 10px 4px 20px 4px;
      scrollbar-width: thin;
    }
    .reelCard {
      flex: 0 0 240px;
      height: 360px;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      transition: transform 0.25s;
    }
    .reelCard:hover {
      transform: scale(1.03);
    }
    .reelCard img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .reelOverlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 16px;
      box-sizing: border-box;
      color: #ffffff;
    }
    .reelPlayIcon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: auto;
      color: #ffffff;
      font-size: 18px;
    }
    .reelTitle {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: #ffffff;
    }
    .reelSubtitle {
      font-size: 12px;
      color: #e2e8f0;
      margin-bottom: 8px;
    }
    .reelPrice {
      font-size: 14px;
      font-weight: 800;
      color: #fde047;
    }

    /* Price Insights Heatmap / Rates Table */
    .priceInsightWrapper {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1px solid #f1f5f9;
    }
    .localityRatesGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }
    .localityRateCard {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .localityRateCard:hover, .localityRateCard.active {
      border-color: var(--primary);
      background: #ffffff;
      box-shadow: 0 6px 18px rgba(217, 34, 40, 0.1);
    }
    .locHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .locName {
      font-size: 15px;
      font-weight: 700;
      color: #1e293b;
    }
    .locGrowth {
      font-size: 12px;
      font-weight: 700;
      color: #16a34a;
      background: #dcfce7;
      padding: 2px 8px;
      border-radius: 12px;
    }
    .locAvgRate {
      font-size: 20px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 4px;
    }
    .locHighlights {
      font-size: 12px;
      color: #64748b;
    }

    /* Everything You Need / Services */
    .servicesTabsWrapper {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 2px solid #e2e8f0;
    }
    .serviceTabBtn {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
    }
    .serviceTabBtn.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }
    .servicesGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
    }
    .serviceCard {
      background: #ffffff;
      border-radius: 14px;
      padding: 24px 20px;
      text-align: center;
      border: 1px solid #f1f5f9;
      box-shadow: 0 4px 15px rgba(0,0,0,0.04);
      transition: all 0.2s;
      cursor: pointer;
    }
    .serviceCard:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      border-color: #fed7aa;
    }
    .serviceCard figure {
      margin: 0 auto 14px auto;
      width: 72px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .serviceCard figure img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .serviceCard strong {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 6px;
    }
    .serviceCard p {
      font-size: 12.5px;
      color: #64748b;
      line-height: 1.4;
      margin: 0;
    }

    /* Top Developers */
    .developersGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
    }
    .developerCard {
      background: #ffffff;
      border-radius: 14px;
      padding: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 14px rgba(0,0,0,0.04);
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .developerCard:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 25px rgba(0,0,0,0.08);
      border-color: var(--primary);
    }
    .devHeader {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .devLogoBox {
      width: 80px;
      height: 60px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
    }
    .devLogoBox img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .devInfo h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
    }
    .devInfo span {
      font-size: 12px;
      color: #64748b;
    }
    .devStatsList {
      display: flex;
      justify-content: space-around;
      background: #f8fafc;
      border-radius: 8px;
      padding: 10px;
      margin: 0;
      list-style: none;
    }
    .devStatsList li {
      text-align: center;
    }
    .devStatsList li strong {
      display: block;
      font-size: 16px;
      font-weight: 800;
      color: var(--primary);
    }
    .devStatsList li span {
      font-size: 11px;
      color: #64748b;
    }

    /* Testimonials / Reviews */
    .reviewsGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    .reviewCard {
      background: #ffffff;
      border-radius: 14px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.04);
    }
    .reviewStars {
      color: #f59e0b;
      font-size: 15px;
      margin-bottom: 12px;
    }
    .reviewText {
      font-size: 14px;
      color: #334155;
      line-height: 1.6;
      margin-bottom: 16px;
      font-style: italic;
    }
    .reviewerInfo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .reviewerAvatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #475569;
    }
    .reviewerMeta strong {
      display: block;
      font-size: 14px;
      color: #1e293b;
    }
    .reviewerMeta span {
      font-size: 12px;
      color: #64748b;
    }

    /* Company Overview (HEALTH values & Mission) */
    .companyOverviewBox {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-radius: 20px;
      padding: 45px 35px;
      color: #ffffff;
      margin-top: 30px;
    }
    .companyOverviewGrid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 36px;
      align-items: center;
    }
    @media (max-width: 768px) {
      .companyOverviewGrid {
        grid-template-columns: 1fr;
      }
    }
    .healthGrid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 20px;
    }
    .healthItem {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      padding: 12px;
      text-align: center;
    }
    .healthLetter {
      font-family: 'Poppins', sans-serif;
      font-size: 24px;
      font-weight: 900;
      color: #fca5a5;
    }
    .healthText {
      font-size: 12px;
      font-weight: 600;
      color: #e2e8f0;
    }

    /* VIP Contact / CTA Banner */
    .vipCtaBanner {
      background: linear-gradient(90deg, #d92228 0%, #be123c 100%);
      border-radius: 20px;
      padding: 40px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 24px;
      margin: 40px 0;
      box-shadow: 0 15px 35px rgba(217, 34, 40, 0.25);
    }
    .vipCtaContent h3 {
      font-family: 'Poppins', sans-serif;
      font-size: 28px;
      font-weight: 800;
      margin: 0 0 8px 0;
    }
    .vipCtaContent p {
      font-size: 15px;
      color: #ffe4e6;
      margin: 0;
    }
    .vipCtaButtons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btnWhiteCall {
      background: #ffffff;
      color: var(--primary);
      border-radius: 30px;
      padding: 12px 28px;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .btnWhiteCall:hover {
      background: #f8fafc;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.15);
    }
    .btnWhatsapp {
      background: #22c55e;
      color: #ffffff;
      border-radius: 30px;
      padding: 12px 28px;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .btnWhatsapp:hover {
      background: #16a34a;
      transform: translateY(-2px);
    }

    /* Footer Styling */
    footer {
      background: #0f172a;
      color: #94a3b8;
      padding: 60px 20px 30px 20px;
      font-size: 13px;
      line-height: 1.6;
    }
    .footerContainer {
      max-width: 1240px;
      margin: 0 auto;
    }
    .footerGrid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
      gap: 32px;
      margin-bottom: 40px;
    }
    @media (max-width: 900px) {
      .footerGrid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 600px) {
      .footerGrid {
        grid-template-columns: 1fr;
      }
    }
    .footerCol h4 {
      color: #ffffff;
      font-size: 15px;
      font-weight: 700;
      margin: 0 0 16px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .footerCol ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .footerCol ul li {
      margin-bottom: 10px;
    }
    .footerCol ul li a {
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.2s;
    }
    .footerCol ul li a:hover {
      color: #ffffff;
      padding-left: 4px;
    }
    .footerAddressBox p {
      margin: 0 0 10px 0;
      color: #cbd5e1;
    }
    .footerAddressBox strong {
      color: #ffffff;
    }
    .footerBottomRow {
      border-top: 1px solid #1e293b;
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 12px;
    }

    /* Floating Quick Action Buttons */
    .floatingContactBar {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 1010;
    }
    .floatBtn {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 24px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.2s;
    }
    .floatBtn:hover {
      transform: scale(1.1);
    }
    .floatWhatsapp {
      background: #25d366;
    }
    .floatCall {
      background: var(--primary);
    }

    /* Interactive Modals */
    .modalBackdrop {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(4px);
      z-index: 2000;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
    }
    .modalBackdrop.show {
      display: flex;
    }
    .modalCard {
      background: #ffffff;
      border-radius: 20px;
      width: 100%;
      max-width: 520px;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0,0,0,0.25);
      position: relative;
      animation: modalFadeIn 0.3s ease-out;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .modalHeader {
      background: #f8fafc;
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modalHeader h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }
    .modalCloseBtn {
      background: transparent;
      border: none;
      font-size: 22px;
      color: #64748b;
      cursor: pointer;
      line-height: 1;
    }
    .modalBody {
      padding: 24px;
    }
    .formGroup {
      margin-bottom: 16px;
    }
    .formGroup label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 6px;
    }
    .formGroup input, .formGroup select, .formGroup textarea {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .formGroup input:focus, .formGroup select:focus, .formGroup textarea:focus {
      border-color: var(--primary);
    }
    .formSubmitBtn {
      width: 100%;
      background: var(--primary);
      color: #ffffff;
      padding: 12px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .formSubmitBtn:hover {
      background: var(--primary-hover);
    }
    .formSuccessNotice {
      display: none;
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      margin-bottom: 16px;
    }
  </style>
</head>
<body page="homePage">

  <!-- ================= HEADER ================= -->
  <header class="active outer">
    <div class="logoBox">
      <a href="index.html" title="Skyyards Bareilly" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
        <img alt="Skyyards Bareilly Logo" class="img-responsive" src="assets/images/skyyards-logo.png" onerror="this.src='assets/images/squareyards.png'">
        <div class="logoText">
          <span class="brandName">SKY<span>YARDS</span></span>
          <span class="brandTag">BAREILLY REAL ESTATE</span>
        </div>
      </a>
    </div>


    <!-- Navigation -->
    <nav>
      <div class="desktopNav">
        <ul class="navItem">
          <li>
            <span class="megaDropDownItem">Buy <em class="icon-angel-down-b" style="font-size:10px;"></em></span>
            <div class="navDropdown">
              <a href="#hot-selling" onclick="filterProjects('Duplex Villas')">Duplex 3BHK Villas</a>
              <a href="#hot-selling" onclick="filterProjects('Residential Plots')">BDA Approved Plots</a>
              <a href="#hot-selling" onclick="filterProjects('Townships')">Townships &amp; Gated Societies</a>
              <a href="#hot-selling" onclick="filterProjects('Commercial')">Commercial Spaces &amp; Shops</a>
              <a href="kings-crest.html">Kings Crest (Dohra Road)</a>
              <a href="olive-homes.html">Olive Homes (Bada Bypass)</a>
              <a href="#eldeco-city">Eldeco City (Nainital Road)</a>
              <a href="#jhm-desire">JHM Desire (Badaun Road)</a>
            </div>
          </li>
          <li>
            <span class="megaDropDownItem">Projects <em class="icon-angel-down-b" style="font-size:10px;"></em></span>
            <div class="navDropdown">
              <a href="kings-crest.html">Kings Crest (Duplex Villas)</a>
              <a href="olive-homes.html">Olive Homes (Plots &amp; Villas)</a>
              <a href="#kings-avenue">King's Avenue (Dohra Road)</a>
              <a href="#jhm-desire">JHM Desire (Badaun Road)</a>
              <a href="#jhm-joy">JHM Joy (Dohra Road)</a>
              <a href="#eldeco-city">Eldeco City (Nainital Road)</a>
              <a href="#jhm-ace">JHM Ace Commercial</a>
            </div>
          </li>
          <li>
            <span class="megaDropDownItem">Services <em class="icon-angel-down-b" style="font-size:10px;"></em></span>
            <div class="navDropdown">
              <a href="#services-section" onclick="switchServiceTab('item_0')">Real Estate Consulting</a>
              <a href="#services-section" onclick="switchServiceTab('item_1')">After Sales Assistance &amp; Registry</a>
              <a href="#services-section" onclick="switchServiceTab('item_2')">Home Loan Services (All Banks)</a>
              <a href="#services-section" onclick="switchServiceTab('item_3')">BDA &amp; RERA Verification</a>
              <a href="#services-section" onclick="switchServiceTab('item_0')">Property Valuation &amp; Tours</a>
            </div>
          </li>
          <li>
            <span class="megaDropDownItem">Localities <em class="icon-angel-down-b" style="font-size:10px;"></em></span>
            <div class="navDropdown">
              <a href="#localities-section">Dohra Road</a>
              <a href="#localities-section">Lalpur &amp; Bada Bypass</a>
              <a href="#localities-section">Nainital Road</a>
              <a href="#localities-section">Badaun Road</a>
              <a href="#localities-section">Ram Ganga Yojna / Greater Bareilly</a>
              <a href="#localities-section">Civil Lines Bareilly</a>
            </div>
          </li>
          <li>
            <a href="about-us.html">About Us</a>
          </li>
          <li>
            <a href="contact-us.html">Contact Us</a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Header Actions -->
    <div class="headerRightSide">
      <a href="tel:08534026777" class="headerCallBtn">
        <em class="icon-phone"></em> 08534026777
      </a>
      <button class="btn loginBtn" onclick="openEnquireModal('General Inquiry', 'Bareilly', '')">
        Schedule Visit
      </button>
      <div class="shortlistDiv" onclick="showFavoritesList()" style="cursor:pointer;" title="Shortlisted Properties">
        <em class="icon-fill-fav">
          <span id="favnumber" class="favnumber" style="display:inline-block;background:var(--primary);color:#fff;border-radius:10px;padding:1px 6px;font-size:11px;">0</span>
        </em>
      </div>
    </div>
  </header>

  <!-- ================= HERO SEARCH SECTION ================= -->
  <section class="search-face-wrap home-search">
    <img class="img-responsive hero-banner" loading="eager" decoding="sync" src="assets/images/home-desktop-cover.png" alt="Skyyards Bareilly Home Banner">
    
    <div class="heroContent">
      <div class="heroRatingBadge">
        <span class="stars">★★★★★</span>
        <span>4.9 / 5 Rating • 1,250+ Bareilly Homeowner Reviews</span>
      </div>

      <h1>Bareilly's Premier<br> <span>Real Estate Platform</span></h1>
      
      <div class="heroSubhead">
        Find Your Dream Home with Commitment, Honesty &amp; Reliability
      </div>

      <div class="heroTickerBox" id="heroTicker">
        ✨ 100% BDA &amp; RERA Approved Duplex Villas &amp; Plots in Bareilly
      </div>

      <!-- Main Search Component -->
      <div class="searchBoxWrapper">
        <div class="searchTabs">
          <div class="searchTabItem active" onclick="setSearchCategory('Buy', this)">Buy</div>
          <div class="searchTabItem" onclick="setSearchCategory('Villas', this)">Duplex Villas</div>
          <div class="searchTabItem" onclick="setSearchCategory('Plots', this)">BDA Plots</div>
          <div class="searchTabItem" onclick="setSearchCategory('Commercial', this)">Commercial</div>
          <div class="searchTabItem" onclick="setSearchCategory('Rent', this)">Rent</div>
        </div>

        <div class="searchControlsGrid">
          <div class="searchInputWrapper">
            <em class="icon-search"></em>
            <input type="text" id="mainSearchInput" placeholder="Search project (Kings Crest, Olive Homes) or locality (Dohra Road)..." autocomplete="off" oninput="handleSearchInput(this.value)">
            <!-- Autocomplete Dropdown -->
            <div class="searchSuggestionsBox" id="searchSuggestions">
              <div class="suggestionGroupTitle">Featured Projects in Bareilly</div>
              <div class="suggestionItem" onclick="selectSuggestion('Kings Crest', 'project')">
                <span class="sugName">Kings Crest — Duplex Villas</span>
                <span class="sugType">Dohra Road</span>
              </div>
              <div class="suggestionItem" onclick="selectSuggestion('Olive Homes', 'project')">
                <span class="sugName">Olive Homes — Plots &amp; Villas</span>
                <span class="sugType">Bada Bypass</span>
              </div>
              <div class="suggestionItem" onclick="selectSuggestion('Eldeco City', 'project')">
                <span class="sugName">Eldeco City — Township</span>
                <span class="sugType">Nainital Road</span>
              </div>
              <div class="suggestionItem" onclick="selectSuggestion('JHM Desire', 'project')">
                <span class="sugName">JHM Desire — 3BHK Villas</span>
                <span class="sugType">Badaun Road</span>
              </div>
              <div class="suggestionItem" onclick="selectSuggestion('King\'s Avenue', 'project')">
                <span class="sugName">King's Avenue — 3BHK Villas</span>
                <span class="sugType">Dohra Road</span>
              </div>
              <div class="suggestionGroupTitle">Top Localities in Bareilly</div>
              <div class="suggestionItem" onclick="selectSuggestion('Dohra Road', 'locality')">
                <span class="sugName">Dohra Road</span>
                <span class="sugType">Prime Villa Hub</span>
              </div>
              <div class="suggestionItem" onclick="selectSuggestion('Lalpur / Bada Bypass', 'locality')">
                <span class="sugName">Lalpur &amp; Bada Bypass</span>
                <span class="sugType">High Growth Plots</span>
              </div>
              <div class="suggestionItem" onclick="selectSuggestion('Nainital Road', 'locality')">
                <span class="sugName">Nainital Road</span>
                <span class="sugType">Townships</span>
              </div>
              <div class="suggestionItem" onclick="selectSuggestion('Badaun Road', 'locality')">
                <span class="sugName">Badaun Road (Opp. Parag Dairy)</span>
                <span class="sugType">Residential</span>
              </div>
            </div>
          </div>

          <div class="searchSelectWrapper">
            <select id="budgetFilter">
              <option value="all">Any Budget</option>
              <option value="under35">Under ₹ 35 Lakh</option>
              <option value="35to70">₹ 35 L - ₹ 70 Lakh</option>
              <option value="70to100">₹ 70 L - ₹ 1 Crore</option>
              <option value="above100">₹ 1 Crore &amp; Above</option>
            </select>
          </div>

          <div class="searchSelectWrapper">
            <select id="propertyTypeFilter">
              <option value="all">All Property Types</option>
              <option value="villa">3BHK Duplex Villa</option>
              <option value="plot">BDA Approved Plot</option>
              <option value="township">Integrated Township</option>
              <option value="commercial">Commercial Shop/Office</option>
            </select>
          </div>

          <button class="searchActionBtn" onclick="executeSearch()">
            <em class="icon-search"></em> Search
          </button>
        </div>
      </div>

      <div class="heroQuickTags">
        <span>Trending in Bareilly:</span>
        <a href="#kings-crest" onclick="selectSuggestion('Kings Crest', 'project')">Kings Crest (₹85L*)</a>
        <a href="#olive-homes" onclick="selectSuggestion('Olive Homes', 'project')">Olive Homes Plots (₹32L*)</a>
        <a href="#eldeco-city" onclick="selectSuggestion('Eldeco City', 'project')">Eldeco City</a>
        <a href="#jhm-desire" onclick="selectSuggestion('JHM Desire', 'project')">JHM Desire</a>
        <a href="#localities-section" onclick="filterProjectsByLocality('Dohra Road')">Dohra Road Villas</a>
      </div>
    </div>
  </section>

  <!-- ================= RECOMMENDATION / REELS SECTION ================= -->
  <section class="white-box recommendation-section bx-no-space" style="background:#ffffff;padding:40px 0;">
    <div class="sectionContainer">
      <div class="title-box">
        <h2 class="title">Trending Video Tours &amp; Project Spotlights in Bareilly</h2>
        <p class="description">Watch authentic site walkthroughs, master layout tours, and construction updates of top developments across Bareilly.</p>
      </div>

      <div class="reelsScrollWrapper">
        <!-- Reel 1: Kings Crest -->
        <div class="reelCard" onclick="openDetailsModal('kings-crest')">
          <img src="assets/images/projects/kings-crest.png" alt="Kings Crest Video Tour">
          <div class="reelOverlay">
            <div class="reelPlayIcon"><em class="icon-play-circle-o"></em></div>
            <h3 class="reelTitle">Kings Crest</h3>
            <div class="reelSubtitle">Duplex 3BHK Villa Walkthrough • Dohra Road</div>
            <div class="reelPrice">Starting ₹ 85 Lac*</div>
          </div>
        </div>

        <!-- Reel 2: Olive Homes -->
        <div class="reelCard" onclick="openDetailsModal('olive-homes')">
          <img src="assets/images/projects/olive-homes.jpg" alt="Olive Homes Site Tour">
          <div class="reelOverlay">
            <div class="reelPlayIcon"><em class="icon-play-circle-o"></em></div>
            <h3 class="reelTitle">Olive Homes</h3>
            <div class="reelSubtitle">BDA Approved Plots Tour • Bada Bypass</div>
            <div class="reelPrice">Starting ₹ 32 Lac*</div>
          </div>
        </div>

        <!-- Reel 3: Eldeco City -->
        <div class="reelCard" onclick="openDetailsModal('eldeco-city')">
          <img src="assets/images/projects/eldeco-city.jpg" alt="Eldeco City Township">
          <div class="reelOverlay">
            <div class="reelPlayIcon"><em class="icon-play-circle-o"></em></div>
            <h3 class="reelTitle">Eldeco City</h3>
            <div class="reelSubtitle">Clubhouse &amp; Township Tour • Nainital Road</div>
            <div class="reelPrice">₹ 45 Lac - ₹ 1.2 Cr*</div>
          </div>
        </div>

        <!-- Reel 4: JHM Desire -->
        <div class="reelCard" onclick="openDetailsModal('jhm-desire')">
          <img src="assets/images/projects/jhm-desire.jpg" alt="JHM Desire Tour">
          <div class="reelOverlay">
            <div class="reelPlayIcon"><em class="icon-play-circle-o"></em></div>
            <h3 class="reelTitle">JHM Desire</h3>
            <div class="reelSubtitle">Modern 3BHK Villas • Badaun Road</div>
            <div class="reelPrice">Starting ₹ 68 Lac*</div>
          </div>
        </div>

        <!-- Reel 5: King's Avenue -->
        <div class="reelCard" onclick="openDetailsModal('kings-avenue')">
          <img src="assets/images/projects/kings-avenue.jpg" alt="King's Avenue Tour">
          <div class="reelOverlay">
            <div class="reelPlayIcon"><em class="icon-play-circle-o"></em></div>
            <h3 class="reelTitle">King's Avenue</h3>
            <div class="reelSubtitle">Gated Duplex Community • Dohra Road</div>
            <div class="reelPrice">Starting ₹ 75 Lac*</div>
          </div>
        </div>

        <!-- Reel 6: JHM Joy -->
        <div class="reelCard" onclick="openDetailsModal('jhm-joy')">
          <img src="assets/images/projects/jhm-joy.jpg" alt="JHM Joy Tour">
          <div class="reelOverlay">
            <div class="reelPlayIcon"><em class="icon-play-circle-o"></em></div>
            <h3 class="reelTitle">JHM Joy</h3>
            <div class="reelSubtitle">Luxury Villa Living • Dohra Road</div>
            <div class="reelPrice">Starting ₹ 72 Lac*</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= HOT SELLING PROJECTS ================= -->
  <section class="white-box hot-selling bx-no-space" id="hot-selling" style="background:#f8fafc;padding:50px 0;">
    <div class="sectionContainer">
      <div class="title-box">
        <h2 class="title">Hot Selling Real Estate Projects in Bareilly</h2>
        <p class="description">Handpicked premium residential developments in Bareilly. Offering legally verified BDA &amp; RERA approvals, gated security, modern lifestyle amenities, and prime connectivity.</p>
      </div>

      <div class="sectionFilterTabs">
        <button class="sectionFilterTab active" onclick="filterProjects('all', this)">All Projects</button>
        <button class="sectionFilterTab" onclick="filterProjects('Duplex Villas', this)">Duplex Villas</button>
        <button class="sectionFilterTab" onclick="filterProjects('Residential Plots', this)">Residential Plots</button>
        <button class="sectionFilterTab" onclick="filterProjects('Townships', this)">Townships</button>
        <button class="sectionFilterTab" onclick="filterProjects('Commercial', this)">Commercial</button>
      </div>

      <div class="projectsGrid" id="projectsContainer">

        <!-- Project 1: King's Crest -->
        <article class="projectCard" data-category="Duplex Villas" data-locality="Dohra Road" id="kings-crest">
          <div class="projectCardImageWrapper">
            <img src="assets/images/projects/kings-crest.png" alt="Kings Crest Dohra Road Bareilly">
            <div class="projectBadges">
              <span class="badgeApproved">BDA &amp; RERA Approved</span>
              <span class="badgeHot">Hot Selling</span>
            </div>
            <button class="favBtn" onclick="toggleFavorite(this, 'Kings Crest')" title="Save to Shortlist">♥</button>
          </div>
          <div class="projectCardBody">
            <div class="projectBuilderName">Kings Developers &amp; Sky Yards</div>
            <h3 class="projectName">King's Crest</h3>
            <div class="projectLocation"><em class="icon-pin-locality"></em> Dohra Road, Bareilly</div>
            <div class="projectPriceRow">
              <div class="priceTag">₹ 85 Lac* <span style="font-size:12px;color:#64748b;font-weight:400;">Onwards</span></div>
              <div class="configTag">3 BHK Duplex Villas</div>
            </div>
            <div class="amenitiesTags">
              <span class="amenityItem">🚪 Gated Society</span>
              <span class="amenityItem">🏋️ Open Gym</span>
              <span class="amenityItem">📷 24x7 CCTV</span>
              <span class="amenityItem">⛹️ Kid's Play Area</span>
              <span class="amenityItem">🏸 Badminton Court</span>
              <span class="amenityItem">💧 24*7 Water</span>
            </div>
            <div class="projectLoanTag">
              🏦 Loan Available up to 80% by All Govt. Banks
            </div>
            <div class="projectCardActions">
              <button class="btnEnquire" onclick="openEnquireModal('Kings Crest', 'Dohra Road, Bareilly', '₹ 85 Lac*')">Enquire Now</button>
              <button class="btnDetails" onclick="openDetailsModal('kings-crest')">View Details</button>
            </div>
          </div>
        </article>

        <!-- Project 2: Olive Homes -->
        <article class="projectCard" data-category="Residential Plots" data-locality="Lalpur & Bada Bypass" id="olive-homes">
          <div class="projectCardImageWrapper">
            <img src="assets/images/projects/olive-homes.jpg" alt="Olive Homes Bada Bypass Bareilly">
            <div class="projectBadges">
              <span class="badgeApproved">BDA Approved</span>
              <span class="badgeHot">High Growth</span>
            </div>
            <button class="favBtn" onclick="toggleFavorite(this, 'Olive Homes')" title="Save to Shortlist">♥</button>
          </div>
          <div class="projectCardBody">
            <div class="projectBuilderName">Olive Greens &amp; Infra</div>
            <h3 class="projectName">Olive Homes</h3>
            <div class="projectLocation"><em class="icon-pin-locality"></em> Lalpur, Bada Bypass, Dohra Road (Near Greater Bareilly)</div>
            <div class="projectPriceRow">
              <div class="priceTag">₹ 32 Lac* - ₹ 35 Lac*</div>
              <div class="configTag">Plots &amp; Villas</div>
            </div>
            <div class="amenitiesTags">
              <span class="amenityItem">🛣️ 40 &amp; 30 ft Wide Roads</span>
              <span class="amenityItem">🌳 Lush Green Parks</span>
              <span class="amenityItem">🛡️ Gated Society</span>
              <span class="amenityItem">🏃 Jogging Tracks</span>
              <span class="amenityItem">⚡ Underground Cabling</span>
            </div>
            <div class="projectLoanTag">
              🏦 Up to 80% Loan by BOB, Canara Bank, HDFC
            </div>
            <div class="projectCardActions">
              <button class="btnEnquire" onclick="openEnquireModal('Olive Homes', 'Lalpur, Bada Bypass, Bareilly', '₹ 32 Lac*')">Enquire Now</button>
              <button class="btnDetails" onclick="openDetailsModal('olive-homes')">View Details</button>
            </div>
          </div>
        </article>

        <!-- Project 3: King's Avenue -->
        <article class="projectCard" data-category="Duplex Villas" data-locality="Dohra Road" id="kings-avenue">
          <div class="projectCardImageWrapper">
            <img src="assets/images/projects/kings-avenue.jpg" alt="King's Avenue Dohra Road Bareilly">
            <div class="projectBadges">
              <span class="badgeApproved">BDA &amp; RERA Approved</span>
            </div>
            <button class="favBtn" onclick="toggleFavorite(this, 'King\'s Avenue')" title="Save to Shortlist">♥</button>
          </div>
          <div class="projectCardBody">
            <div class="projectBuilderName">Kings Developers</div>
            <h3 class="projectName">King's Avenue</h3>
            <div class="projectLocation"><em class="icon-pin-locality"></em> Dohra Road, Bareilly</div>
            <div class="projectPriceRow">
              <div class="priceTag">₹ 75 Lac* <span style="font-size:12px;color:#64748b;font-weight:400;">Onwards</span></div>
              <div class="configTag">3 BHK Duplex Villas</div>
            </div>
            <div class="amenitiesTags">
              <span class="amenityItem">🍳 Modular Kitchen</span>
              <span class="amenityItem">🚪 Built-in Wardrobes</span>
              <span class="amenityItem">🔌 EV Charging Point</span>
              <span class="amenityItem">🌳 Garden &amp; Play Area</span>
              <span class="amenityItem">🛡️ 24x7 Security</span>
            </div>
            <div class="projectLoanTag">
              🏦 Pre-Approved by SBI &amp; All Major Banks
            </div>
            <div class="projectCardActions">
              <button class="btnEnquire" onclick="openEnquireModal('King\'s Avenue', 'Dohra Road, Bareilly', '₹ 75 Lac*')">Enquire Now</button>
              <button class="btnDetails" onclick="openDetailsModal('kings-avenue')">View Details</button>
            </div>
          </div>
        </article>

        <!-- Project 4: JHM Desire -->
        <article class="projectCard" data-category="Duplex Villas" data-locality="Badaun Road" id="jhm-desire">
          <div class="projectCardImageWrapper">
            <img src="assets/images/projects/jhm-desire.jpg" alt="JHM Desire Badaun Road Bareilly">
            <div class="projectBadges">
              <span class="badgeApproved">BDA &amp; RERA Approved</span>
              <span class="badgeHot">Ready Soon</span>
            </div>
            <button class="favBtn" onclick="toggleFavorite(this, 'JHM Desire')" title="Save to Shortlist">♥</button>
          </div>
          <div class="projectCardBody">
            <div class="projectBuilderName">JHM Group</div>
            <h3 class="projectName">JHM Desire</h3>
            <div class="projectLocation"><em class="icon-pin-locality"></em> Opp. Parag Dairy, Badaun Road, Bareilly</div>
            <div class="projectPriceRow">
              <div class="priceTag">₹ 68 Lac* <span style="font-size:12px;color:#64748b;font-weight:400;">Onwards</span></div>
              <div class="configTag">3 BHK Duplex Villas</div>
            </div>
            <div class="amenitiesTags">
              <span class="amenityItem">🚪 Gated Society</span>
              <span class="amenityItem">🏋️ Fitness Gym</span>
              <span class="amenityItem">🍳 Modular Kitchen</span>
              <span class="amenityItem">🔌 EV Charging</span>
              <span class="amenityItem">🛣️ Wide Inner Roads</span>
            </div>
            <div class="projectLoanTag">
              🏦 Up to 80% Loan by Govt &amp; Private Banks
            </div>
            <div class="projectCardActions">
              <button class="btnEnquire" onclick="openEnquireModal('JHM Desire', 'Opp. Parag Dairy, Badaun Road', '₹ 68 Lac*')">Enquire Now</button>
              <button class="btnDetails" onclick="openDetailsModal('jhm-desire')">View Details</button>
            </div>
          </div>
        </article>

        <!-- Project 5: JHM Joy -->
        <article class="projectCard" data-category="Duplex Villas" data-locality="Dohra Road" id="jhm-joy">
          <div class="projectCardImageWrapper">
            <img src="assets/images/projects/jhm-joy.jpg" alt="JHM Joy Dohra Road Bareilly">
            <div class="projectBadges">
              <span class="badgeApproved">BDA &amp; RERA Approved</span>
            </div>
            <button class="favBtn" onclick="toggleFavorite(this, 'JHM Joy')" title="Save to Shortlist">♥</button>
          </div>
          <div class="projectCardBody">
            <div class="projectBuilderName">JHM Group</div>
            <h3 class="projectName">JHM Joy</h3>
            <div class="projectLocation"><em class="icon-pin-locality"></em> Dohra Road, Bareilly</div>
            <div class="projectPriceRow">
              <div class="priceTag">₹ 72 Lac* <span style="font-size:12px;color:#64748b;font-weight:400;">Onwards</span></div>
              <div class="configTag">3 BHK Duplex Villas</div>
            </div>
            <div class="amenitiesTags">
              <span class="amenityItem">🍳 Designer Kitchen</span>
              <span class="amenityItem">🚪 Modern Wardrobes</span>
              <span class="amenityItem">🌳 Landscaped Park</span>
              <span class="amenityItem">🛡️ 24x7 Security</span>
            </div>
            <div class="projectLoanTag">
              🏦 Loan Assistance up to 80%
            </div>
            <div class="projectCardActions">
              <button class="btnEnquire" onclick="openEnquireModal('JHM Joy', 'Dohra Road, Bareilly', '₹ 72 Lac*')">Enquire Now</button>
              <button class="btnDetails" onclick="openDetailsModal('jhm-joy')">View Details</button>
            </div>
          </div>
        </article>

        <!-- Project 6: Eldeco City -->
        <article class="projectCard" data-category="Townships" data-locality="Nainital Road" id="eldeco-city">
          <div class="projectCardImageWrapper">
            <img src="assets/images/projects/eldeco-city.jpg" alt="Eldeco City Nainital Road Bareilly">
            <div class="projectBadges">
              <span class="badgeApproved">BDA &amp; RERA Approved</span>
              <span class="badgeHot">Integrated Township</span>
            </div>
            <button class="favBtn" onclick="toggleFavorite(this, 'Eldeco City')" title="Save to Shortlist">♥</button>
          </div>
          <div class="projectCardBody">
            <div class="projectBuilderName">Eldeco Group</div>
            <h3 class="projectName">Eldeco City</h3>
            <div class="projectLocation"><em class="icon-pin-locality"></em> Nainital Road, Bareilly</div>
            <div class="projectPriceRow">
              <div class="priceTag">₹ 45 Lac - ₹ 1.2 Cr*</div>
              <div class="configTag">Plots, Villas &amp; Flats</div>
            </div>
            <div class="amenitiesTags">
              <span class="amenityItem">🏊 Swimming Pool</span>
              <span class="amenityItem">🏛️ Grand Club House</span>
              <span class="amenityItem">🎾 Sports Facility</span>
              <span class="amenityItem">🏫 School &amp; Shopping</span>
              <span class="amenityItem">🛡️ 3-Tier Security</span>
            </div>
            <div class="projectLoanTag">
              🏦 Approved by All Nationalized Banks
            </div>
            <div class="projectCardActions">
              <button class="btnEnquire" onclick="openEnquireModal('Eldeco City', 'Nainital Road, Bareilly', '₹ 45 Lac*')">Enquire Now</button>
              <button class="btnDetails" onclick="openDetailsModal('eldeco-city')">View Details</button>
            </div>
          </div>
        </article>

        <!-- Project 7: JHM Ace Commercial -->
        <article class="projectCard" data-category="Commercial" data-locality="Dohra Road" id="jhm-ace">
          <div class="projectCardImageWrapper">
            <img src="assets/images/projects/jhm-ace-commercial.jpg" alt="JHM Ace Commercial Dohra Road">
            <div class="projectBadges">
              <span class="badgeApproved">BDA Approved</span>
              <span class="badgeHot">Sky Yards HQ</span>
            </div>
            <button class="favBtn" onclick="toggleFavorite(this, 'JHM Ace Commercial')" title="Save to Shortlist">♥</button>
          </div>
          <div class="projectCardBody">
            <div class="projectBuilderName">JHM Group</div>
            <h3 class="projectName">JHM Ace Commercial</h3>
            <div class="projectLocation"><em class="icon-pin-locality"></em> Dohra Road, Bareilly U.P. 243005</div>
            <div class="projectPriceRow">
              <div class="priceTag">Price on Request</div>
              <div class="configTag">Showrooms &amp; Offices</div>
            </div>
            <div class="amenitiesTags">
              <span class="amenityItem">🏢 Prime Road Frontage</span>
              <span class="amenityItem">🚗 Ample Customer Parking</span>
              <span class="amenityItem">⚡ 100% Power Backup</span>
              <span class="amenityItem">📈 High Footfall Zone</span>
            </div>
            <div class="projectLoanTag">
              🏦 Commercial Loan Assistance Available
            </div>
            <div class="projectCardActions">
              <button class="btnEnquire" onclick="openEnquireModal('JHM Ace Commercial', 'Dohra Road, Bareilly', 'Price on Request')">Enquire Now</button>
              <button class="btnDetails" onclick="openDetailsModal('jhm-ace')">View Details</button>
            </div>
          </div>
        </article>

      </div>
    </div>
  </section>

  <!-- ================= REFERRAL BANNER ================= -->
  <section class="white-box" style="background:#ffffff;padding:40px 0;">
    <div class="sectionContainer">
      <div style="background:linear-gradient(135deg, #fff1f2 0%, #fef2f2 100%);border:2px solid #fecaca;border-radius:20px;padding:36px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px;">
        <div style="max-width:600px;">
          <span style="background:var(--primary);color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;text-transform:uppercase;">Sky Yards Rewards</span>
          <h2 style="font-family:'Poppins', sans-serif;font-size:26px;font-weight:800;color:#1e293b;margin:12px 0 8px 0;">Refer a friend for Duplex Villas, Plots or Home Loans in Bareilly &amp; Earn Rewards!</h2>
          <p style="color:#64748b;font-size:14px;margin:0;">Earn guaranteed cash vouchers, luxury dining, jewelry gifts, and home decor items when your referred friend books with Sky Yards.</p>
        </div>
        <div>
          <button class="searchActionBtn" style="padding:14px 28px;" onclick="openEnquireModal('Referral Program', 'Bareilly', '')">
            Refer &amp; Earn Now
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= PROPERTY PRICE INSIGHTS ================= -->
  <section class="white-box home-page-widgets price-insight price-insight-india bx-no-space" id="insights-section" style="background:#f8fafc;padding:50px 0;">
    <div class="sectionContainer">
      <div class="title-box">
        <h2 class="title">Property Price Insights in Bareilly</h2>
        <p class="description">Accurate price trends, median square foot rates, and micro-market growth analytics across Bareilly. Make smarter real estate choices backed by verified registry data.</p>
      </div>

      <div class="priceInsightWrapper">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
          <div>
            <strong style="font-size:18px;color:#1e293b;">Bareilly Micro-Market Index (2026)</strong>
            <div style="font-size:13px;color:#64748b;">Average residential capital appreciation: +14.6% YoY</div>
          </div>
          <div style="background:#dcfce7;color:#15803d;padding:6px 14px;border-radius:20px;font-weight:700;font-size:12px;">
            High Growth Corridor: Bada Bypass &amp; Dohra Road
          </div>
        </div>

        <div class="localityRatesGrid">
          <!-- Locality 1 -->
          <div class="localityRateCard active" onclick="selectInsightCard(this, 'Dohra Road', '₹ 4,650', '+14.2%')">
            <div class="locHeader">
              <span class="locName">Dohra Road</span>
              <span class="locGrowth">▲ +14.2%</span>
            </div>
            <div class="locAvgRate">₹ 4,650 <span style="font-size:12px;color:#64748b;font-weight:400;">/ sq.ft</span></div>
            <div class="locHighlights">Hotspot for luxury duplex villas (Kings Crest, Kings Avenue, JHM Joy, JHM Ace).</div>
          </div>

          <!-- Locality 2 -->
          <div class="localityRateCard" onclick="selectInsightCard(this, 'Lalpur / Bada Bypass', '₹ 2,850', '+18.5%')">
            <div class="locHeader">
              <span class="locName">Lalpur &amp; Bada Bypass</span>
              <span class="locGrowth">▲ +18.5%</span>
            </div>
            <div class="locAvgRate">₹ 2,850 <span style="font-size:12px;color:#64748b;font-weight:400;">/ sq.ft</span></div>
            <div class="locHighlights">Top growth plotted development zone near Greater Bareilly (Olive Homes).</div>
          </div>

          <!-- Locality 3 -->
          <div class="localityRateCard" onclick="selectInsightCard(this, 'Nainital Road', '₹ 4,100', '+11.8%')">
            <div class="locHeader">
              <span class="locName">Nainital Road</span>
              <span class="locGrowth">▲ +11.8%</span>
            </div>
            <div class="locAvgRate">₹ 4,100 <span style="font-size:12px;color:#64748b;font-weight:400;">/ sq.ft</span></div>
            <div class="locHighlights">Established highway corridor featuring Eldeco City and medical institutions.</div>
          </div>

          <!-- Locality 4 -->
          <div class="localityRateCard" onclick="selectInsightCard(this, 'Badaun Road', '₹ 3,350', '+12.4%')">
            <div class="locHeader">
              <span class="locName">Badaun Road</span>
              <span class="locGrowth">▲ +12.4%</span>
            </div>
            <div class="locAvgRate">₹ 3,350 <span style="font-size:12px;color:#64748b;font-weight:400;">/ sq.ft</span></div>
            <div class="locHighlights">Fast-growing residential belt opposite Parag Dairy (JHM Desire).</div>
          </div>

          <!-- Locality 5 -->
          <div class="localityRateCard" onclick="selectInsightCard(this, 'Ram Ganga Yojna', '₹ 3,100', '+16.0%')">
            <div class="locHeader">
              <span class="locName">Ram Ganga Yojna</span>
              <span class="locGrowth">▲ +16.0%</span>
            </div>
            <div class="locAvgRate">₹ 3,100 <span style="font-size:12px;color:#64748b;font-weight:400;">/ sq.ft</span></div>
            <div class="locHighlights">BDA planned mega scheme with wide avenues, educational &amp; administrative hubs.</div>
          </div>

          <!-- Locality 6 -->
          <div class="localityRateCard" onclick="selectInsightCard(this, 'Civil Lines', '₹ 8,200', '+8.5%')">
            <div class="locHeader">
              <span class="locName">Civil Lines Bareilly</span>
              <span class="locGrowth">▲ +8.5%</span>
            </div>
            <div class="locAvgRate">₹ 8,200 <span style="font-size:12px;color:#64748b;font-weight:400;">/ sq.ft</span></div>
            <div class="locHighlights">Bareilly's premier central commercial &amp; elite residential address.</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= EVERYTHING YOU NEED / SERVICES ================= -->
  <section class="white-box everything-need" id="services-section" style="background:#ffffff;padding:50px 0;">
    <div class="sectionContainer">
      <div class="title-box">
        <h2 class="title">Everything You Need at One Place</h2>
        <p class="description">Sky Yards Consulting Services brings complete end-to-end real estate assistance under one roof in Bareilly.</p>
      </div>

      <div class="servicesTabsWrapper">
        <div class="serviceTabBtn active" onclick="switchServiceTab('item_0', this)">For Home Buyers</div>
        <div class="serviceTabBtn" onclick="switchServiceTab('item_1', this)">For Plot Investors</div>
        <div class="serviceTabBtn" onclick="switchServiceTab('item_2', this)">Home Loans &amp; Finance</div>
        <div class="serviceTabBtn" onclick="switchServiceTab('item_3', this)">After Sales &amp; Management</div>
      </div>

      <!-- Tab Content: Buyers -->
      <div class="servicesGrid active" id="serviceTabContent">
        <div class="serviceCard" onclick="openEnquireModal('Real Estate Consulting', 'Bareilly', '')">
          <figure><img src="assets/images/squareyard-services/valuation.png" alt="Real Estate Consulting"></figure>
          <strong>Real Estate Consulting</strong>
          <p>Unbiased property comparison, verified BDA/RERA approvals, and transparent pricing in Bareilly.</p>
        </div>

        <div class="serviceCard" onclick="openEnquireModal('Home Loan Services', 'Bareilly', '')">
          <figure><img src="assets/images/squareyard-services/home-loan.png" alt="Home Loan Services"></figure>
          <strong>Home Loan Services</strong>
          <p>Up to 80% financing from BOB, Canara Bank, HDFC, SBI, PNB with low interest rates &amp; fast approvals.</p>
        </div>

        <div class="serviceCard" onclick="openEnquireModal('After Sales Assistance', 'Bareilly', '')">
          <figure><img src="assets/images/squareyard-services/property-management.png" alt="After Sales Assistance"></figure>
          <strong>After Sales Assistance</strong>
          <p>Seamless registry facilitation, mutation support, utility connection, and possession handover.</p>
        </div>

        <div class="serviceCard" onclick="openEnquireModal('Home Interiors', 'Bareilly', '')">
          <figure><img src="assets/images/squareyard-services/home-interior.png" alt="Home Interiors"></figure>
          <strong>Home Interior Design</strong>
          <p>Custom modular kitchens, wardrobe setups, smart home automation, and turnkey villa decor.</p>
        </div>

        <div class="serviceCard" onclick="openEnquireModal('Property Valuation', 'Bareilly', '')">
          <figure><img src="assets/images/squareyard-services/sell-or-rent-property.png" alt="Property Valuation"></figure>
          <strong>Property Valuation</strong>
          <p>Accurate market pricing assessment and registry valuation benchmarks for residential &amp; commercial assets.</p>
        </div>

        <div class="serviceCard" onclick="openEnquireModal('Vastu Calculator', 'Bareilly', '')">
          <figure><img src="assets/images/squareyard-services/vastu-calculator.png" alt="Vastu Advisory"></figure>
          <strong>Vastu Advisory</strong>
          <p>Professional architectural and layout analysis ensuring positive energy and peace of mind.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= CUSTOMER REVIEWS ================= -->
  <section class="customer-reviews-box" style="background:#f8fafc;padding:50px 0;">
    <div class="sectionContainer">
      <div class="title-box">
        <h2 class="title">What Homeowners Say About Sky Yards Bareilly</h2>
        <p class="description">Trusted by thousands of families and investors across Bareilly and Uttar Pradesh.</p>
      </div>

      <div class="reviewsGrid">
        <div class="reviewCard">
          <div class="reviewStars">★★★★★</div>
          <div class="reviewText">"We booked our dream 3BHK duplex villa in Kings Crest on Dohra Road. The Sky Yards team arranged the site visits, helped us compare options, and got our bank loan processed with SBI in just 10 days. Outstanding honesty and service!"</div>
          <div class="reviewerInfo">
            <div class="reviewerAvatar">AS</div>
            <div class="reviewerMeta">
              <strong>Amit &amp; Sneha Saxena</strong>
              <span>Homeowners, Kings Crest, Dohra Road</span>
            </div>
          </div>
        </div>

        <div class="reviewCard">
          <div class="reviewStars">★★★★★</div>
          <div class="reviewText">"Purchased two residential plots in Olive Homes near Bada Bypass. BDA approval papers were 100% genuine and clear. The appreciation in this Greater Bareilly corridor has already exceeded our expectations. Highly recommended!"</div>
          <div class="reviewerInfo">
            <div class="reviewerAvatar">RA</div>
            <div class="reviewerMeta">
              <strong>Dr. Rajesh Agarwal</strong>
              <span>Investor, Olive Homes, Lalpur</span>
            </div>
          </div>
        </div>

        <div class="reviewCard">
          <div class="reviewStars">★★★★★</div>
          <div class="reviewText">"Relocating to Bareilly from Delhi was smooth thanks to Sky Yards. Mr. Kashif Qadri and his team guided us through Eldeco City and JHM Desire. Their after-sales registry and mutation assistance was completely stress-free."</div>
          <div class="reviewerInfo">
            <div class="reviewerAvatar">VK</div>
            <div class="reviewerMeta">
              <strong>Vikramaditya Khanna</strong>
              <span>Resident, Eldeco City, Nainital Road</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= DISCOVER MORE PROPERTY TYPES ================= -->
  <section class="white-box discover-more collection-india" style="background:#ffffff;padding:50px 0;">
    <div class="sectionContainer">
      <div class="title-box">
        <h2 class="title">Discover More Real Estate Properties in Bareilly</h2>
        <p class="description">Explore tailored property types designed for every lifestyle and budget in Bareilly.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));gap:20px;">
        <div class="serviceCard" onclick="filterProjects('Duplex Villas')">
          <figure><img src="assets/images/collections-images/builder-floors.webp" alt="Duplex Villas"></figure>
          <strong>Duplex Villas</strong>
          <p>Gated community villas on Dohra Road &amp; Badaun Road starting ₹68 Lac*</p>
        </div>

        <div class="serviceCard" onclick="filterProjects('Residential Plots')">
          <figure><img src="assets/images/collections-images/ae.webp" alt="Residential Plots"></figure>
          <strong>BDA Approved Plots</strong>
          <p>Prime plots at Olive Homes &amp; Greater Bareilly starting ₹32 Lac*</p>
        </div>

        <div class="serviceCard" onclick="filterProjects('Townships')">
          <figure><img src="assets/images/collections-images/Apartments.webp" alt="Townships"></figure>
          <strong>Integrated Townships</strong>
          <p>Clubhouse, swimming pool &amp; sports amenities at Eldeco City</p>
        </div>

        <div class="serviceCard" onclick="filterProjects('Commercial')">
          <figure><img src="assets/images/collections-images/ce.webp" alt="Commercial Properties"></figure>
          <strong>Commercial Spaces</strong>
          <p>Showrooms &amp; offices at JHM Ace Commercial, Dohra Road</p>
        </div>

        <div class="serviceCard" onclick="filterProjects('all')">
          <figure><img src="assets/images/collections-images/pentHouse.webp" alt="Luxury Living"></figure>
          <strong>Luxury Homes</strong>
          <p>Exclusive residences with modern elevations and EV charging</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= TOP LOCALITIES ================= -->
  <section class="white-box localitygroup bx-no-space" id="localities-section" style="background:#f8fafc;padding:50px 0;">
    <div class="sectionContainer">
      <div class="title-box">
        <h2 class="title">Top Localities in Bareilly</h2>
        <p class="description">Explore Bareilly's top residential and investment neighbourhoods known for high liveability, wide roads, and rapid capital appreciation.</p>
      </div>

      <div class="localityRatesGrid">
        <div class="localityRateCard" onclick="filterProjectsByLocality('Dohra Road')">
          <div class="locHeader">
            <span class="locName">📍 Dohra Road</span>
            <span class="locGrowth">Prime Villa Hub</span>
          </div>
          <div class="locAvgRate">₹ 4,650 / sq.ft</div>
          <div class="locHighlights">Home to Kings Crest, Kings Avenue, JHM Joy, JHM Ace Commercial. Gated societies with wide 40ft roads.</div>
        </div>

        <div class="localityRateCard" onclick="filterProjectsByLocality('Lalpur & Bada Bypass')">
          <div class="locHeader">
            <span class="locName">📍 Lalpur &amp; Bada Bypass</span>
            <span class="locGrowth">High Appreciation</span>
          </div>
          <div class="locAvgRate">₹ 2,850 / sq.ft</div>
          <div class="locHighlights">Fastest growing plotted corridor close to Greater Bareilly and Ram Ganga Yojna. Site of Olive Homes.</div>
        </div>

        <div class="localityRateCard" onclick="filterProjectsByLocality('Nainital Road')">
          <div class="locHeader">
            <span class="locName">📍 Nainital Road</span>
            <span class="locGrowth">Township Zone</span>
          </div>
          <div class="locAvgRate">₹ 4,100 / sq.ft</div>
          <div class="locHighlights">Major connectivity highway, top educational institutions, world-class township living at Eldeco City.</div>
        </div>

        <div class="localityRateCard" onclick="filterProjectsByLocality('Badaun Road')">
          <div class="locHeader">
            <span class="locName">📍 Badaun Road</span>
            <span class="locGrowth">Residential Corridor</span>
          </div>
          <div class="locAvgRate">₹ 3,350 / sq.ft</div>
          <div class="locHighlights">Well connected, opposite Parag Dairy, home to modern 3BHK duplex villas like JHM Desire.</div>
        </div>

        <div class="localityRateCard" onclick="filterProjectsByLocality('Ram Ganga Yojna')">
          <div class="locHeader">
            <span class="locName">📍 Ram Ganga Yojna / Greater Bareilly</span>
            <span class="locGrowth">BDA Planned City</span>
          </div>
          <div class="locAvgRate">₹ 3,100 / sq.ft</div>
          <div class="locHighlights">Master planned urban expansion with proposed institutional sectors, parks, and wide avenues.</div>
        </div>

        <div class="localityRateCard" onclick="filterProjectsByLocality('Civil Lines')">
          <div class="locHeader">
            <span class="locName">📍 Civil Lines &amp; Suresh Sharma Nagar</span>
            <span class="locGrowth">Elite Central</span>
          </div>
          <div class="locAvgRate">₹ 8,200 / sq.ft</div>
          <div class="locHighlights">Prestigious city center, luxury independent floors, proximity to Bareilly Junction and civic centers.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= TOP DEVELOPERS ================= -->
  <section class="white-box top-developer bx-no-space" style="background:#ffffff;padding:50px 0;">
    <div class="sectionContainer">
      <div class="title-box">
        <h2 class="title">Top Developers in Bareilly</h2>
        <p class="description">Partnered with Bareilly's most reputable real estate developers known for superior construction quality, timely delivery, and legal compliance.</p>
      </div>

      <div class="developersGrid">
        <!-- Developer 1 -->
        <article class="developerCard">
          <div class="devHeader">
            <div class="devLogoBox">
              <img src="assets/images/developerlogo/jhm-group.svg" alt="JHM Group Bareilly">
            </div>
            <div class="devInfo">
              <h4>JHM Group</h4>
              <span>Bareilly, Uttar Pradesh</span>
            </div>
          </div>
          <ul class="devStatsList">
            <li><strong>3+</strong><span>Projects</span></li>
            <li><strong>15+</strong><span>Years Exp.</span></li>
            <li><strong>100%</strong><span>BDA Verified</span></li>
          </ul>
          <p style="font-size:12.5px;color:#64748b;margin:0;">Builders of JHM Ace Commercial, JHM Desire, and JHM Joy on Dohra Road and Badaun Road.</p>
        </article>

        <!-- Developer 2 -->
        <article class="developerCard">
          <div class="devHeader">
            <div class="devLogoBox">
              <img src="assets/images/developerlogo/eldeco-group.svg" alt="Eldeco Group Bareilly">
            </div>
            <div class="devInfo">
              <h4>Eldeco Group</h4>
              <span>National Developer</span>
            </div>
          </div>
          <ul class="devStatsList">
            <li><strong>35+</strong><span>Years Legacy</span></li>
            <li><strong>175+</strong><span>Projects</span></li>
            <li><strong>RERA</strong><span>Approved</span></li>
          </ul>
          <p style="font-size:12.5px;color:#64748b;margin:0;">Pioneers in township infrastructure in India, creators of Eldeco City Bareilly on Nainital Road.</p>
        </article>

        <!-- Developer 3 -->
        <article class="developerCard">
          <div class="devHeader">
            <div class="devLogoBox">
              <img src="assets/images/developerlogo/kings-group.svg" alt="Kings Developers Bareilly">
            </div>
            <div class="devInfo">
              <h4>Kings Developers</h4>
              <span>Bareilly, Uttar Pradesh</span>
            </div>
          </div>
          <ul class="devStatsList">
            <li><strong>2+</strong><span>Villa Estates</span></li>
            <li><strong>10+</strong><span>Years Exp.</span></li>
            <li><strong>BDA</strong><span>Approved</span></li>
          </ul>
          <p style="font-size:12.5px;color:#64748b;margin:0;">Specialists in luxury duplex villas including Kings Crest and King's Avenue on Dohra Road.</p>
        </article>

        <!-- Developer 4 -->
        <article class="developerCard">
          <div class="devHeader">
            <div class="devLogoBox">
              <img src="assets/images/developerlogo/olive-greens.svg" alt="Olive Greens & Infra">
            </div>
            <div class="devInfo">
              <h4>Olive Greens &amp; Infra</h4>
              <span>Bareilly, Uttar Pradesh</span>
            </div>
          </div>
          <ul class="devStatsList">
            <li><strong>1</strong><span>Township</span></li>
            <li><strong>BDA</strong><span>Sanctioned</span></li>
            <li><strong>Plots</strong><span>&amp; Villas</span></li>
          </ul>
          <p style="font-size:12.5px;color:#64748b;margin:0;">Developers of Olive Homes at Lalpur, Bada Bypass, very close to Greater Bareilly.</p>
        </article>

        <!-- Developer 5 -->
        <article class="developerCard">
          <div class="devHeader">
            <div class="devLogoBox">
              <img src="assets/images/developerlogo/skyyards-realty.svg" alt="Sky Yards Consulting">
            </div>
            <div class="devInfo">
              <h4>Sky Yards Realty</h4>
              <span>Bareilly Corporate HQ</span>
            </div>
          </div>
          <ul class="devStatsList">
            <li><strong>10+</strong><span>Associated</span></li>
            <li><strong>2500+</strong><span>Happy Clients</span></li>
            <li><strong>#1</strong><span>Consultancy</span></li>
          </ul>
          <p style="font-size:12.5px;color:#64748b;margin:0;">Bareilly's top real estate consulting firm, headquartered at JHM Ace Commercial, Dohra Road.</p>
        </article>
      </div>
    </div>
  </section>

  <!-- ================= ABOUT SKYYARDS BAREILLY (HEALTH VALUES & MISSION) ================= -->
  <section class="largest-platform-box" id="about-section" style="background:#f8fafc;padding:50px 0;">
    <div class="sectionContainer">
      <div class="companyOverviewBox">
        <div class="companyOverviewGrid">
          <div>
            <span style="background:rgba(255,255,255,0.15);padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">About Sky Yards Bareilly</span>
            <h2 style="font-family:'Poppins', sans-serif;font-size:32px;font-weight:800;margin:12px 0 16px 0;line-height:1.2;">Delivering the Dream of Home Ownership in Bareilly</h2>
            <p style="font-size:14px;color:#cbd5e1;line-height:1.7;margin-bottom:14px;">
              <strong>Sky Yards</strong> is a leading real estate consulting company in India with a clear vision to succeed on the principles of <strong>Commitment, Honesty and Reliability</strong>. Buying property is one of life's most critical decisions, requiring real-time advice, honest property comparisons, physical tours, legal due diligence, and home loan assistance.
            </p>
            <p style="font-size:14px;color:#cbd5e1;line-height:1.7;">
              Our mission is simple: <strong>Delivering the dream of home ownership everywhere.</strong> Our vision: <strong>Win, Make, Give, and Do Good.</strong>
            </p>
          </div>

          <div>
            <h3 style="font-family:'Poppins', sans-serif;font-size:20px;font-weight:700;margin:0 0 10px 0;color:#fde047;">Our Core Values: H.E.A.L.T.H.</h3>
            <p style="font-size:13px;color:#94a3b8;margin:0 0 16px 0;">Our values define who we are and govern every transaction we handle for our clients in Bareilly:</p>
            
            <div class="healthGrid">
              <div class="healthItem">
                <div class="healthLetter">H</div>
                <div class="healthText">Hard Work</div>
              </div>
              <div class="healthItem">
                <div class="healthLetter">E</div>
                <div class="healthText">Extraordinary Results</div>
              </div>
              <div class="healthItem">
                <div class="healthLetter">A</div>
                <div class="healthText">Accountable in All Things</div>
              </div>
              <div class="healthItem">
                <div class="healthLetter">L</div>
                <div class="healthText">Leaders Only</div>
              </div>
              <div class="healthItem">
                <div class="healthLetter">T</div>
                <div class="healthText">Teamwork</div>
              </div>
              <div class="healthItem">
                <div class="healthLetter">H</div>
                <div class="healthText">Humble</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= VIP CTA BANNER ================= -->
  <section class="sectionContainer" id="contact-section">
    <div class="vipCtaBanner">
      <div class="vipCtaContent">
        <h3>Schedule a Free Private Site Visit Today</h3>
        <p>Explore Kings Crest, Olive Homes, JHM Desire or Eldeco City with our senior property consultants.</p>
        <p style="font-size:13px;color:#fecdd3;margin-top:6px;">📍 Head Office: SKY YARDS, JHM Ace Commercial, Dohra Road, Bareilly U.P. 243005</p>
      </div>
      <div class="vipCtaButtons">
        <a href="tel:08534026777" class="btnWhiteCall">
          <em class="icon-phone"></em> Call 08534026777
        </a>
        <a href="https://wa.me/918534026777?text=Hi%20Skyyards%20Bareilly,%20I%20would%20like%20to%20schedule%20a%20site%20visit" target="_blank" class="btnWhatsapp">
          <em class="icon-whatsapp"></em> WhatsApp Us
        </a>
      </div>
    </div>
  </section>

  <!-- ================= FOOTER ================= -->
  <footer>
    <div class="footerContainer">
      <div class="footerGrid">
        <div class="footerCol">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
            <img src="assets/images/skyyards-logo.png" alt="Skyyards Bareilly" style="height:36px;width:auto;" onerror="this.src='assets/images/squareyards.png'">
            <span style="font-family:'Poppins', sans-serif;font-size:18px;font-weight:800;color:#fff;">SKY<span style="color:var(--primary);">YARDS</span></span>
          </div>
          <p style="color:#94a3b8;font-size:12.5px;line-height:1.6;margin-bottom:16px;">
            Sky Yards Bareilly is a premier real estate consulting firm founded on Commitment, Honesty and Reliability. Assisting homebuyers, plot investors, and businesses with 100% verified properties.
          </p>
          <div class="footerAddressBox">
            <p><strong>Corporate Office:</strong><br>SKY YARDS, JHM Ace Commercial, Dohra Road, Bareilly, Uttar Pradesh 243005</p>
            <p><strong>Direct Helplines:</strong><br>📞 <a href="tel:08534026777" style="color:#fff;text-decoration:none;">08534026777</a>, <a href="tel:08218095851" style="color:#fff;text-decoration:none;">08218095851</a></p>
            <p><strong>Official Email:</strong><br>✉️ <a href="mailto:skyyardsofficial@gmail.com" style="color:#fff;text-decoration:none;">skyyardsofficial@gmail.com</a></p>
          </div>
        </div>

        <div class="footerCol">
          <h4>Featured Projects</h4>
          <ul>
            <li><a href="#kings-crest">Kings Crest (Dohra Road)</a></li>
            <li><a href="#olive-homes">Olive Homes (Bada Bypass)</a></li>
            <li><a href="#kings-avenue">King's Avenue (Dohra Road)</a></li>
            <li><a href="#jhm-desire">JHM Desire (Badaun Road)</a></li>
            <li><a href="#jhm-joy">JHM Joy (Dohra Road)</a></li>
            <li><a href="#eldeco-city">Eldeco City (Nainital Road)</a></li>
            <li><a href="#jhm-ace">JHM Ace Commercial</a></li>
          </ul>
        </div>

        <div class="footerCol">
          <h4>Top Localities</h4>
          <ul>
            <li><a href="#localities-section">Dohra Road Bareilly</a></li>
            <li><a href="#localities-section">Lalpur &amp; Bada Bypass</a></li>
            <li><a href="#localities-section">Nainital Road</a></li>
            <li><a href="#localities-section">Badaun Road (Parag Dairy)</a></li>
            <li><a href="#localities-section">Ram Ganga Yojna / Greater Bareilly</a></li>
            <li><a href="#localities-section">Civil Lines Bareilly</a></li>
            <li><a href="#localities-section">Pilibhit Bypass Road</a></li>
          </ul>
        </div>

        <div class="footerCol">
          <h4>Our Services</h4>
          <ul>
            <li><a href="#services-section">Real Estate Consulting</a></li>
            <li><a href="#services-section">After Sales Assistance</a></li>
            <li><a href="#services-section">Home Loan Services (Up to 80%)</a></li>
            <li><a href="#services-section">BDA &amp; RERA Verification</a></li>
            <li><a href="#services-section">Property Valuation</a></li>
            <li><a href="#services-section">Turnkey Home Interiors</a></li>
            <li><a href="#services-section">Vastu Advisory</a></li>
          </ul>
        </div>

        <div class="footerCol">
          <h4>Quick Connect</h4>
          <p style="font-size:12.5px;color:#cbd5e1;margin-bottom:12px;">Get instant project brochures, rate lists, and schedule free site visits directly with our team.</p>
          <button class="btnEnquire" style="width:100%;margin-bottom:10px;padding:12px;" onclick="openEnquireModal('Schedule Visit', 'Bareilly', '')">Schedule Site Visit</button>
          <a href="https://wa.me/918534026777?text=Hi%20Skyyards%20Bareilly" target="_blank" class="btnWhatsapp" style="display:block;text-align:center;padding:10px;">Chat on WhatsApp</a>
        </div>
      </div>

      <div class="footerBottomRow">
        <div>
          © 2026 <strong>Skyyards Bareilly</strong> (Sky Yards Consulting Services). All rights reserved.
        </div>
        <div style="color:#64748b;">
          Disclaimer: All project information, layouts, and rates are based on official developer disclosures. Properties are subject to BDA &amp; RERA approvals.
        </div>
      </div>
    </div>
  </footer>

  <!-- ================= FLOATING CONTACT ACTION BUTTONS ================= -->
  <div class="floatingContactBar">
    <a href="https://wa.me/918534026777?text=Hi%20Skyyards%20Bareilly,%20I%20am%20interested%20in%20property%20details" target="_blank" class="floatBtn floatWhatsapp" title="Chat on WhatsApp">
      💬
    </a>
    <a href="tel:08534026777" class="floatBtn floatCall" title="Call Sky Yards">
      📞
    </a>
  </div>

  <!-- ================= ENQUIRE / SCHEDULE VISIT MODAL ================= -->
  <div class="modalBackdrop" id="enquireModal">
    <div class="modalCard">
      <div class="modalHeader">
        <h3 id="modalProjectTitle">Enquire About Property</h3>
        <button class="modalCloseBtn" onclick="closeModal('enquireModal')">&times;</button>
      </div>
      <div class="modalBody">
        <div class="formSuccessNotice" id="formSuccessNotice">
          ✅ Thank you! Your site visit request has been received. Our senior property advisor will contact you within 15 minutes.
        </div>
        <form id="leadEnquiryForm" onsubmit="handleFormSubmit(event)">
          <div class="formGroup">
            <label>Full Name *</label>
            <input type="text" id="leadName" required placeholder="Enter your full name">
          </div>
          <div class="formGroup">
            <label>Phone Number *</label>
            <input type="tel" id="leadPhone" required placeholder="10-digit mobile number" pattern="[0-9]{10}">
          </div>
          <div class="formGroup">
            <label>Email Address</label>
            <input type="email" id="leadEmail" placeholder="yourname@gmail.com">
          </div>
          <div class="formGroup">
            <label>Select Project / Requirement *</label>
            <select id="leadProjectSelect">
              <option value="Kings Crest (Dohra Road)">Kings Crest (3BHK Duplex Villas • Dohra Road)</option>
              <option value="Olive Homes (Bada Bypass)">Olive Homes (BDA Approved Plots • Bada Bypass)</option>
              <option value="King's Avenue (Dohra Road)">King's Avenue (3BHK Duplex Villas)</option>
              <option value="JHM Desire (Badaun Road)">JHM Desire (3BHK Villas • Badaun Road)</option>
              <option value="JHM Joy (Dohra Road)">JHM Joy (Duplex Villas • Dohra Road)</option>
              <option value="Eldeco City (Nainital Road)">Eldeco City (Integrated Township)</option>
              <option value="JHM Ace Commercial">JHM Ace Commercial (Showrooms/Offices)</option>
              <option value="General Consultation">General Real Estate Consultation / Home Loan</option>
            </select>
          </div>
          <div class="formGroup">
            <label>Preferred Date for Free Site Visit</label>
            <input type="date" id="leadDate">
          </div>
          <button type="submit" class="formSubmitBtn">Book Free Site Visit &amp; Get Price List</button>
        </form>
      </div>
    </div>
  </div>

  <!-- ================= PROJECT DETAILS MODAL ================= -->
  <div class="modalBackdrop" id="detailsModal">
    <div class="modalCard" style="max-width:680px;max-height:90vh;overflow-y:auto;">
      <div class="modalHeader">
        <h3 id="detailsTitle">Project Details</h3>
        <button class="modalCloseBtn" onclick="closeModal('detailsModal')">&times;</button>
      </div>
      <div class="modalBody" id="detailsBody">
        <!-- Injected dynamically -->
      </div>
    </div>
  </div>

  <!-- ================= CITY SELECTOR MODAL ================= -->
  <div class="modalBackdrop" id="cityModal">
    <div class="modalCard" style="max-width:440px;">
      <div class="modalHeader">
        <h3>Select City / Locality</h3>
        <button class="modalCloseBtn" onclick="closeModal('cityModal')">&times;</button>
      </div>
      <div class="modalBody">
        <div style="font-size:13px;font-weight:700;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;">Bareilly Micro-Markets</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
          <button class="sectionFilterTab active" onclick="setCity('Bareilly - Dohra Road')">Dohra Road</button>
          <button class="sectionFilterTab" onclick="setCity('Bareilly - Bada Bypass')">Bada Bypass</button>
          <button class="sectionFilterTab" onclick="setCity('Bareilly - Nainital Road')">Nainital Road</button>
          <button class="sectionFilterTab" onclick="setCity('Bareilly - Badaun Road')">Badaun Road</button>
          <button class="sectionFilterTab" onclick="setCity('Bareilly - Ramganga Nagar')">Ramganga Nagar</button>
          <button class="sectionFilterTab" onclick="setCity('Bareilly - Civil Lines')">Civil Lines</button>
        </div>
        <div style="font-size:13px;font-weight:700;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;">Nearby Regional Cities</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button class="sectionFilterTab" onclick="setCity('Moradabad')">Moradabad</button>
          <button class="sectionFilterTab" onclick="setCity('Lucknow')">Lucknow</button>
          <button class="sectionFilterTab" onclick="setCity('Noida')">Noida</button>
          <button class="sectionFilterTab" onclick="setCity('Delhi NCR')">Delhi NCR</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ================= JAVASCRIPT LOGIC ================= -->
  <script src="assets/js/jquery-ea73d0b2ec.min.js"></script>
  <script>
    // Project specifications database
    const projectDetailsData = {
      'kings-crest': {
        name: "King's Crest",
        developer: "Kings Developers & Sky Yards",
        location: "Dohra Road, Bareilly",
        price: "Starting at ₹ 85 Lac* Onwards",
        config: "3 BHK Luxury Duplex Villas",
        approval: "BDA & RERA Approved",
        image: "assets/images/projects/kings-crest.png",
        features: [
          "Gated Society with Grand Entrance Gate",
          "Open Gym & Wellness Fitness Zone",
          "24x7 Security with CCTV Surveillance",
          "Kid's Play Area & Dedicated Yoga Space",
          "Professional Badminton Court",
          "Landscaped Greens Surrounded by Trees",
          "24*7 Underground Water Supply",
          "Underground Electric Cabling"
        ],
        loan: "Loan Available UPTO 80% by All Govt. & Private Banks.",
        overview: "Discover Kings Crest — Bareilly's most sought-after gated villa community on Dohra Road. Experience luxury living in a spacious duplex villa designed for pure comfort, modern architecture, and high appreciation."
      },
      'olive-homes': {
        name: "Olive Homes",
        developer: "Olive Greens & Infra",
        location: "Lalpur, Bada Bypass, Dohra Road, Bareilly",
        price: "Plots & Villas Starting at ₹ 32 Lac* / ₹ 35 Lac* Onwards",
        config: "BDA Approved Residential Plots & Villas",
        approval: "BDA Approved Real Estate Project",
        image: "assets/images/projects/olive-homes.jpg",
        features: [
          "BDA Approved – Safe & Legally Secure Investment",
          "Strategic Location Close to Greater Bareilly & Ram Ganga Yojna",
          "40 & 30 ft Wide Planned Inner Roads",
          "Lush Green Parks & Open Spaces",
          "24x7 Security with CCTV & Manned Entry-Exit Points",
          "Modern Underground Sewer & Drainage System",
          "Uninterrupted Water & Electricity Supply",
          "Children's Play Area & Jogging Tracks"
        ],
        loan: "Loan Available UPTO 80% by Bank of Baroda (BOB), Canara Bank, HDFC, etc.",
        overview: "A smart investment and premium living destination. Olive Homes offers BDA approved plots and villas at Lalpur, Bada Bypass, Dohra Road, very close to Greater Bareilly and Ram Ganga Yojna."
      },
      'kings-avenue': {
        name: "King's Avenue",
        developer: "Kings Developers",
        location: "Dohra Road, Bareilly",
        price: "Starting at ₹ 75 Lac* Onwards",
        config: "3 BHK Duplex Villas",
        approval: "BDA & RERA Approved",
        image: "assets/images/projects/kings-avenue.jpg",
        features: [
          "Gated Society with CCTV Surveillance",
          "Garden with Kid's Play Area",
          "Wide Internal Concrete Roads",
          "Fully Equipped Fitness Gym",
          "Modular Kitchen & Built-in Wardrobes Included",
          "Dedicated EV Charging Point for Each Villa",
          "Underground Utilities & Street Lighting"
        ],
        loan: "Up to 80% Loan by SBI & All Major Banks",
        overview: "King's Avenue delivers masterfully designed 3BHK duplex villas with contemporary architectural elevation, ready amenities, and prime connectivity on Dohra Road Bareilly."
      },
      'jhm-desire': {
        name: "JHM Desire",
        developer: "JHM Group",
        location: "Opposite Parag Dairy, Badaun Road, Bareilly",
        price: "Starting at ₹ 68 Lac* Onwards",
        config: "3 BHK Duplex Villas",
        approval: "BDA & RERA Approved",
        image: "assets/images/projects/jhm-desire.jpg",
        features: [
          "Gated Villa Society with CCTV Security",
          "Designer Garden with Kid's Play Zone",
          "Wide Asphalt Roads with Footpaths",
          "Modern Gymnasium",
          "Factory-Finished Modular Kitchen & Wardrobes",
          "Dedicated EV Vehicle Charging Point",
          "24/7 Power Backup Provisions"
        ],
        loan: "Up to 80% Bank Loan Available",
        overview: "Located opposite Parag Dairy on fast-growing Badaun Road, JHM Desire offers stylish 3BHK duplex villas built with high-grade materials and full BDA legal clearance."
      },
      'jhm-joy': {
        name: "JHM Joy",
        developer: "JHM Group",
        location: "Dohra Road, Bareilly",
        price: "Starting at ₹ 72 Lac* Onwards",
        config: "3 BHK Duplex Villas",
        approval: "BDA & RERA Approved",
        image: "assets/images/projects/jhm-joy.jpg",
        features: [
          "Gated Villa Community",
          "Children's Play Park & Green Lawns",
          "Wide Internal Roads",
          "Fully Fitted Modular Kitchen",
          "Custom Wooden Wardrobes in Bedrooms",
          "Round-the-clock Water & Security"
        ],
        loan: "Loan Facility UPTO 80% by All Banks",
        overview: "JHM Joy combines affordable luxury and tranquil living on Dohra Road Bareilly, perfect for growing families seeking security, comfort and prime connectivity."
      },
      'eldeco-city': {
        name: "Eldeco City",
        developer: "Eldeco Group",
        location: "Nainital Road, Bareilly",
        price: "Starting at ₹ 45 Lac to ₹ 1.2 Cr*",
        config: "Integrated Township (Plots, Villas & Apartments)",
        approval: "BDA & RERA Approved",
        image: "assets/images/projects/eldeco-city.jpg",
        features: [
          "Grand Resident Club House",
          "Full Size Swimming Pool & Kids Splash Pool",
          "Multipurpose Sports Courts & Tennis",
          "24/7 3-Tier Security with Guard Patrols",
          "Proposed School & Commercial Shopping Complex",
          "Lush Landscaped Theme Gardens",
          "Wide Tree-Lined Boulevards"
        ],
        loan: "Pre-Approved by All Major Nationalized & Private Banks",
        overview: "A world-class integrated township on Nainital Road Bareilly by renowned national builder Eldeco Group. Experience holistic community living with international-grade infrastructure."
      },
      'jhm-ace': {
        name: "JHM Ace Commercial",
        developer: "JHM Group",
        location: "Dohra Road, Bareilly U.P. 243005",
        price: "Price on Request",
        config: "Premium Retail Showrooms & Executive Office Suites",
        approval: "BDA Sanctioned Commercial Complex",
        image: "assets/images/projects/jhm-ace-commercial.jpg",
        features: [
          "Prime Main Road Frontage on Dohra Road",
          "Home to Sky Yards Corporate Headquarters",
          "High Footfall Commercial Hotspot",
          "Dedicated Two-Level Customer Parking",
          "100% Uninterrupted Power Backup",
          "High-Speed Elevators & Modern Glass Facade"
        ],
        loan: "Commercial Mortgage Available",
        overview: "JHM Ace Commercial is the landmark commercial hub on Dohra Road Bareilly, offering high-visibility retail showrooms and corporate office spaces with immense rental yield potential."
      }
    };

    // Favorites Management
    let favorites = JSON.parse(localStorage.getItem('skyyards_favs') || '[]');
    updateFavCounter();

    function toggleFavorite(btn, projectName) {
      if (favorites.includes(projectName)) {
        favorites = favorites.filter(f => f !== projectName);
        btn.classList.remove('active');
        btn.innerHTML = '♥';
      } else {
        favorites.push(projectName);
        btn.classList.add('active');
        btn.innerHTML = '❤️';
      }
      localStorage.setItem('skyyards_favs', JSON.stringify(favorites));
      updateFavCounter();
    }

    function updateFavCounter() {
      const counter = document.getElementById('favnumber');
      if (counter) counter.innerText = favorites.length;
    }

    function showFavoritesList() {
      if (favorites.length === 0) {
        alert("You haven't saved any properties to your shortlist yet. Click the heart icon on any project to shortlist it!");
      } else {
        alert("Your Shortlisted Properties in Bareilly:\\n\\n" + favorites.map((f, i) => (i+1) + ". " + f).join("\\n") + "\\n\\nOur consultant can schedule a consolidated tour for all these properties!");
      }
    }

    // Modal Control
    function openModal(id) {
      document.getElementById(id).classList.add('show');
    }
    function closeModal(id) {
      document.getElementById(id).classList.remove('show');
    }

    // Enquire Modal
    function openEnquireModal(project, locality, price) {
      document.getElementById('modalProjectTitle').innerText = "Enquire About " + project;
      const select = document.getElementById('leadProjectSelect');
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.toLowerCase().includes(project.toLowerCase())) {
          select.selectedIndex = i;
          break;
        }
      }
      openModal('enquireModal');
    }

    // Details Modal
    function openDetailsModal(projectId) {
      const p = projectDetailsData[projectId];
      if (!p) return;
      document.getElementById('detailsTitle').innerText = p.name + " — " + p.location;
      let html = '<div style="margin-bottom:16px;">' +
        '<img src="' + p.image + '" style="width:100%;height:260px;object-fit:cover;border-radius:12px;margin-bottom:14px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">' +
          '<div style="font-size:22px;font-weight:800;color:var(--primary);">' + p.price + '</div>' +
          '<span style="background:#16a34a;color:#fff;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:700;">' + p.approval + '</span>' +
        '</div>' +
        '<div style="font-size:13px;color:#64748b;margin-bottom:16px;"><strong>Developer:</strong> ' + p.developer + ' | <strong>Configuration:</strong> ' + p.config + '</div>' +
        '<p style="font-size:14px;color:#334155;line-height:1.6;margin-bottom:18px;">' + p.overview + '</p>' +
        '<div style="background:#f8fafc;padding:16px;border-radius:10px;margin-bottom:18px;border:1px solid #e2e8f0;">' +
          '<strong style="display:block;font-size:15px;color:#1e293b;margin-bottom:10px;">Key Features &amp; Project Highlights:</strong>' +
          '<ul style="margin:0;padding-left:20px;font-size:13px;color:#475569;line-height:1.8;">' +
            p.features.map(f => '<li>' + f + '</li>').join('') +
          '</ul>' +
        '</div>' +
        '<div style="background:#e0f2fe;color:#0369a1;padding:12px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:20px;">' +
          '🏦 ' + p.loan +
        '</div>' +
        '<div style="display:flex;gap:12px;">' +
          '<button class="formSubmitBtn" style="flex:1;" onclick="closeModal(\\'detailsModal\\');openEnquireModal(\\'' + p.name + '\\', \\'' + p.location + '\\', \\'' + p.price + '\\')">Book Free Site Visit</button>' +
          '<a href="tel:08534026777" class="btnWhiteCall" style="border:1px solid #cbd5e1;text-align:center;justify-content:center;">📞 Call 08534026777</a>' +
        '</div>' +
      '</div>';
      document.getElementById('detailsBody').innerHTML = html;
      openModal('detailsModal');
    }

    // City Selector
    function openCityModal() {
      openModal('cityModal');
    }
    function setCity(cityName) {
      document.getElementById('currentCityLabel').innerText = cityName;
      closeModal('cityModal');
    }

    // Lead Form Submission
    function handleFormSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('leadName').value;
      const phone = document.getElementById('leadPhone').value;
      const project = document.getElementById('leadProjectSelect').value;
      const notice = document.getElementById('formSuccessNotice');
      notice.style.display = 'block';
      notice.innerHTML = '✅ <strong>Thank you ' + name + '!</strong><br>Your inquiry for <strong>' + project + '</strong> has been registered. Our senior consultant in Dohra Road, Bareilly will contact you at <strong>' + phone + '</strong> with complete brochures and pricing details.';
      document.getElementById('leadEnquiryForm').reset();
      setTimeout(function() {
        closeModal('enquireModal');
        notice.style.display = 'none';
      }, 5000);
    }

    // Search Category Tabs
    let currentSearchCategory = 'Buy';
    function setSearchCategory(cat, el) {
      currentSearchCategory = cat;
      document.querySelectorAll('.searchTabItem').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
    }

    // Search Autocomplete
    function handleSearchInput(val) {
      const box = document.getElementById('searchSuggestions');
      if (val.trim().length > 0) {
        box.style.display = 'block';
      } else {
        box.style.display = 'none';
      }
    }
    function selectSuggestion(name, type) {
      document.getElementById('mainSearchInput').value = name;
      document.getElementById('searchSuggestions').style.display = 'none';
      executeSearch();
    }
    // Close suggestions on outside click
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.searchInputWrapper')) {
        document.getElementById('searchSuggestions').style.display = 'none';
      }
    });

    // Execute Search Filter
    function executeSearch() {
      const q = document.getElementById('mainSearchInput').value.toLowerCase().trim();
      const budget = document.getElementById('budgetFilter').value;
      const ptype = document.getElementById('propertyTypeFilter').value;
      
      const cards = document.querySelectorAll('.projectCard');
      let found = 0;

      cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        let match = true;
        if (q && !text.includes(q)) match = false;
        if (match) {
          card.style.display = 'flex';
          found++;
        } else {
          card.style.display = 'none';
        }
      });

      // Smooth scroll to projects section
      document.getElementById('hot-selling').scrollIntoView({ behavior: 'smooth' });
    }

    // Project Filter Tabs
    function filterProjects(category, btn) {
      if (btn) {
        document.querySelectorAll('.sectionFilterTab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      const cards = document.querySelectorAll('.projectCard');
      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      document.getElementById('hot-selling').scrollIntoView({ behavior: 'smooth' });
    }

    function filterProjectsByLocality(loc) {
      const cards = document.querySelectorAll('.projectCard');
      cards.forEach(card => {
        const cardLoc = card.getAttribute('data-locality');
        if (cardLoc.toLowerCase().includes(loc.toLowerCase())) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      document.getElementById('hot-selling').scrollIntoView({ behavior: 'smooth' });
    }

    // Price Insights
    function selectInsightCard(card, locName, rate, growth) {
      document.querySelectorAll('.localityRateCard').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    }

    // Service Tabs
    function switchServiceTab(tabId, btn) {
      if (btn) {
        document.querySelectorAll('.serviceTabBtn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    }

    // Rotating Hero Ticker Animation
    const tickerTexts = [
      "✨ 100% BDA & RERA Approved Duplex Villas & Plots in Bareilly",
      "🏡 Kings Crest: 3BHK Duplex Villas Starting ₹85 Lac* on Dohra Road",
      "🌱 Olive Homes: BDA Approved Plots from ₹32 Lac* at Bada Bypass",
      "🏦 Up to 80% Home Loan by Bank of Baroda, Canara, HDFC, SBI",
      "🔑 Complete After Sales Assistance & Legal Registry Due Diligence",
      "🏆 Sky Yards Bareilly: Commitment, Honesty & Reliability"
    ];
    let tickerIdx = 0;
    setInterval(function() {
      tickerIdx = (tickerIdx + 1) % tickerTexts.length;
      const el = document.getElementById('heroTicker');
      if (el) {
        el.style.opacity = '0';
        setTimeout(function() {
          el.innerText = tickerTexts[tickerIdx];
          el.style.opacity = '1';
        }, 300);
      }
    }, 4000);
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent, 'utf8');
console.log('Successfully created index.html (', htmlContent.length, 'bytes)');
