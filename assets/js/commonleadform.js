let building_id;
let categoryId = '';
let newdata = {};
// let isTrueCaller = -1;

// THE placement vocabulary rule — one implementation, every caller.
//
// `formname` is forwarded to the lead system as pageType and is gated by its own pageCategory
// allowlists, so it is not ours to widen; the analytics name rides data-sy-formname on the form
// element instead, which commonleadform.ejs renders for every pageCategory.
//
// This chain used to exist in THREE places that had already drifted apart by two terms —
// commonleadform.ejs (`…|| pageCategory || formboxid`), here (`…|| ''`) and pulseApiHelper.js
// (`sy_form_placement || formname || pageCategory || formboxid`). They happened to reduce to the
// same answer, but only by coincidence of how the terms nested, and that is exactly how the earlier
// verify-path split hid: one form filing its opens under one key and its conversions under another,
// on the most valuable stage of the funnel. The tail is not decorative either — for a form with no
// name the open resolved `pageCategory` at EJS RENDER time while the server resolved it from the
// OTP body at SUBMIT time, and those genuinely differ for the same form (cmaEnquireAll renders
// `shortlist_enquiry` and initialises with `PROJECT`).
//
// So the client now resolves the whole chain once, here, and SENDS it as sy_form_placement — which
// the server takes first. All three lead events agree by construction rather than by coincidence.
// `$('form#…')` scopes to the form element: the id is reused across files (ClientInfoForm appears in
// eight), and `$('#id')` takes the first match in the document while the fallback below is a
// descendant scan of it — so an unrelated duplicate could answer for the form actually submitted.
const getSyFormPlacement = (formid, pageCategory, formboxid) => $(`form#${formid}`).attr('data-sy-formname') || $(`form#${formid} input#dev_formname`).val() || pageCategory || formboxid || '';

const global_submitContactForm = function (formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, pageCategory, isdsepage, iscommonleadform, formtype, listingtype, loadviewinpopup) {
	// lead_form_open — THE single hook, for every lead form on the site.
	//
	// It used to live in commonleadform.ejs's initializeCommonLeadForm, which covers the ~91 call
	// sites of /getcommonleadform but NOT the three legacy contact-form partials
	// (contact-form.ejs, contact-form-dse.ejs, contact-form-beats.ejs). Those wire themselves up by
	// calling this function directly, so they submit through the same OTP endpoints and produce
	// lead_otp_requested / lead_verified — but emitted no open at all. Their funnel had conversions
	// with no top stage, on unit, gallery, NBR, propAmc, listing-DSE and blog-DSE.
	//
	// This function is what all 8 of those call sites funnel through, including
	// initializeCommonLeadForm, so hooking it here covers every form once. Exactly once: each caller
	// invokes it a single time per rendered form, and the common lead form reaches it through a
	// setInterval that clears on the first successful call.
	//
	// It fires on INTENT, not on wiring. This function runs whenever a form is BUILT, and an inline
	// or sticky form is built at page load with the visitor doing nothing — the project-detail and
	// agent-detail sidebars, the builder and unit stickies, and the legacy contact-form partials on
	// listing / unit / gallery / blog. Emitting there counted a page view as an enquiry: 181.9k
	// "opens" against 7,380 OTP requests, a 96% "drop" at the top of the funnel that was never a
	// drop, just page views wearing a funnel label.
	//
	// A popup only ever exists because the visitor asked for it, so building one IS the open. An
	// inline form is already on the page, so its open is the first time the visitor touches it.
	// A form that is merely rendered and never touched emits nothing, which is the whole point.
	// Both events and the guard keep it to at most one per built form (`one` binds each event name
	// separately, so a click that also focuses would otherwise fire twice).
	if (window.syPulse) {
		// WHICH ACT PRODUCED THIS OPEN — the two branches below are not the same event.
		//
		// `summoned`: a popup only exists because the visitor asked for it, so building it IS the open.
		// `engaged`:  an inline or sticky form is already on the page; its open is the first touch.
		//
		// They convert at wildly different rates because they measure wildly different intent — live,
		// summoned forms run 45-62% open→OTP while engaged ones run 0.2-5%, and REAL-ESTATE-GLOSSARY
		// recorded 245 engaged opens on 370 page views with zero leads. Averaging them into one "opens"
		// number and one "open → lead" rate makes both meaningless. Sending the trigger is the whole
		// fix; the dashboard then reports a rate WITHIN a population instead of across two.
		const syOpenTrigger = loadviewinpopup ? 'summoned' : 'engaged';
		let syOpenSent = false;
		const syTrackLeadFormOpen = () => {
			if (syOpenSent) return;
			syOpenSent = true;
			window.syPulse.track('lead_form_open', {
				form_placement: getSyFormPlacement(formid, pageCategory, formboxid),
				form_box_id: formboxid || '',
				form_type: formtype || '',
				open_trigger: syOpenTrigger,
				lead_type: ($(`#${formid}_formaction`).val() || '').toLowerCase() === 'whatsapp' ? 'whatsapp' : 'call'
			});
		};
		if (loadviewinpopup) {
			syTrackLeadFormOpen();
		} else {
			$(`#${formid}`).one('focusin click', syTrackLeadFormOpen);
		}
	}

	$(`#${formid}`).keypress((e) => {
		if (e.which === 13) {
			$(`#${formid}`).find("button[type='submit']").click();
		}
	});

	$(`#${otpboxformid}`).keypress((e) => {
		if (e.which === 13) {
			$(`#${otpboxformid} #confirmOtp_contactform`).trigger('click');
		}
	});

	$(`#${changeNumberformid}`).keypress((e) => {
		if (e.which === 13) {
			$(`#${changeNumberformid}`).trigger('submit');
		}
	});

	$(`#${formid}`).off('submit');
	$(`#${formid}`).on('submit', (e) => {
		e.preventDefault();

		if (formboxid == "dev_upcoming_project_detail_form_sticky_formbox1") {
			$(".globalModal,.globalOverflow").addClass("active");
		}

		if (formtype == "LISTING") {
			const typeOfUser = e.target.formUserTypeId.defaultValue.toLowerCase();
			let typeOfCurrPage;
			if (listingtype.toLowerCase() == 'resale') {
				typeOfCurrPage = 'Resale';
			} else {
				typeOfCurrPage = 'Rental';
			}

			let classToAdd; let classToRemove;
			let iswhatsappclick = "0";
			if ($(`#${formid} input[name='iswhatsappclick']`).length > 0) {
				iswhatsappclick = $(`#${formid} input[name='iswhatsappclick']`).attr("value");
			}
			const isActive = iswhatsappclick == "1";

			if (isActive && typeOfUser == 'owner') {
				classToAdd = 'L3';
				classToRemove = 'L4';
			} else if (isActive && typeOfUser != 'owner') {
				classToAdd = 'L1';
				classToRemove = 'L2';
			} else if (!isActive && typeOfUser == 'owner') {
				classToAdd = 'L4';
				classToRemove = 'L3';
			} else if (!isActive && typeOfUser != 'owner') {
				classToAdd = 'L2';
				classToRemove = 'L1';
			}

			$(`#${otpboxformid} #confirmOtp_contactform`).addClass(`Detail_${typeOfCurrPage}_${classToAdd}`).removeClass(`Detail_${typeOfCurrPage}_${classToRemove}`);
		}
		if (formtype == 'DIDEMO') {
			const selBusinessServicesAvail = $(`#${formid} .custom-multiselect-dropdown`);
			if (selBusinessServicesAvail && selBusinessServicesAvail.length) {
				const selBusinessServicesText = $(`#${formid} .custom-multiselect-dropdown input[type="checkbox"]:checked`).map(function () { return $(this).val(); }).get().join(", ");
				if (selBusinessServicesText) {
					$(`#${formid}`).find("input[name='businessServices']").val(selBusinessServicesText);
				} else {
					helperJS.alertBox('error', "Please select at least one Business Service to Continue with your enquiry");
					return false;
				}
			}
		}
		if (formtype == 'PROJECT') {
			const selInterestedInAvail = $(`#${formid} .choiceList`);
			if (selInterestedInAvail && selInterestedInAvail.length) {
				const selInterestedIn = $(`#${formid} .choiceList .selected`);
				const selInterestedInTextArray = [];
				selInterestedIn.each(function () {
					selInterestedInTextArray.push($(this).text());
				});
				let selInterestedInText = selInterestedInTextArray.join(", ");
				if (selInterestedInText === "Buying soon") {
					selInterestedInText = "Buying";
				} else if (selInterestedInText === "Just exploring") {
					selInterestedInText = "Explore";
				} else if (selInterestedInText == "Planning to Sell") {
					selInterestedInText = "Selling";
				}

				if (selInterestedInText) {
					$(`#${formid}`).find("input[name='interestedIn']").val(selInterestedInText);
				} else {
					helperJS.alertBox('error', "Please select at least one Interest Type to Continue with your enquiry");
					return false;
				}
			}
			$('body').off('click', '.select-bhk-box .bhk-list li');
			$('body').on('click', '.select-bhk-box .bhk-list li', function () {
				if ($(this).hasClass('more-units')) {
					$('.select-bhk-box .bhk-list li.hidden-unit').removeClass('hidden-unit');
					$(this).hide();
				}
				$(this).toggleClass('selected');
			});
		}

		globalsendOtp(formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, pageCategory, isdsepage, iscommonleadform, false, building_id, formtype, listingtype,unitSizes = [], unitPrices = [], unitCategories = [], loadviewinpopup);
	});

	const updateprofileformid = `${formid}_dev_updateprofileform`;
	$(`#${updateprofileformid}`).off("submit");
	$(`#${updateprofileformid}`).on("submit", (e) => {
		e.preventDefault();
		$('#loaderBox').show();

		const countryCode = $(`#${updateprofileformid} #updateprofile_countrycode`).val();
		const mobile = $(`#${updateprofileformid} #updateprofile_mobile`).val();
		const name = $(`#${updateprofileformid} #updateprofile_name`).val();
		const email = $(`#${updateprofileformid} #updateprofile_email`).val();

		$.ajax({
			type: "POST",
			url: `${baseUrl}user/update-user-by-mobile`,
			async: true,
			contentType: "application/json",
			data: JSON.stringify({ countryCode, mobile, name, email }),
			success(response) {
				globalsendOtp(formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, pageCategory, isdsepage, iscommonleadform, true, building_id, formtype, listingtype,unitSizes = [], unitPrices = [], unitCategories = [], loadviewinpopup);
			},
			error(xhr, error) {
				helperJS.alertBox('error', "Something went wrong,try again");
				$('#loaderBox').hide();
			}
		});
	});

	$(`#${formid}_filledLeadBox`).find(".dev_filledleadbtn").off("click");
	$(`#${formid}_filledLeadBox`).find(".dev_filledleadbtn").on("click", () => {
		const unitsData = $(`#${formid}_unitsData`).val() || '';
		let parsedData;
		if (typeof unitsData != 'undefined' && unitsData) {
			parsedData = JSON.parse(unitsData);
		}
		const unitSizes = [];
		const unitPrices = [];
		const unitCategories = [];
		if (parsedData && parsedData.length > 0 && parsedData.length == 1) {
			if (parsedData[0].unitSize) unitSizes.push(parsedData[0].unitSize);
			if (parsedData[0].price) unitPrices.push(parsedData[0].price);
			if (parsedData[0].category) unitCategories.push(parsedData[0].category);
		}
		globalsendOtp(formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, pageCategory, isdsepage, iscommonleadform, true, building_id, formtype, listingtype, unitSizes, unitPrices, unitCategories,loadviewinpopup);
	});

	$(`#${changeNumberformid}`).on('submit', (e) => {
		e.preventDefault();
		const newcountrycode = $(`#${changeNumberformid}`).find("select[name='countryCode']").val();
		const newmobileno = $(`#${changeNumberformid}`).find("input[name='mobile']").val();

		$(`#${formid}`).find("select[name='countryCode']").val(newcountrycode);
		$(`#${formid}`).find("input[name='mobile']").val(newmobileno);

		globalsendOtp(formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, pageCategory, isdsepage, iscommonleadform, false, building_id, formtype, listingtype,unitSizes = [], unitPrices = [], unitCategories = [], loadviewinpopup);

		if (isdsepage == true) {
			$(`#${formid}`).addClass("active");
			$(`#${otpboxformid}`).addClass("active");
			$(`#${changeNumberformid}`).removeClass("active");
			$(`#${modalpopupid}`).removeClass("active");
		}
	});

	$(`#${otpboxformid} span.resend`).off("click");
	$(`#${otpboxformid} span.resend`).on('click', () => {
		globalsendOtp(formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, pageCategory, isdsepage, iscommonleadform, false, building_id, formtype, listingtype,unitSizes = [], unitPrices = [], unitCategories = [], loadviewinpopup);
	});

	if (iscommonleadform == true) {
		$(`#${otpboxformid} .resendOtpBox .resendLink`).off("click");
		$(`#${otpboxformid} .resendOtpBox .resendLink`).on("click", () => {
			globalsendOtp(formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, pageCategory, isdsepage, iscommonleadform, false, building_id, formtype, listingtype,unitSizes = [], unitPrices = [], unitCategories = [], loadviewinpopup);
		});
	}

	$(`#${otpboxformid} #confirmOtp_contactform`).off("click");
	$(`#${otpboxformid} #confirmOtp_contactform`).on('click', () => {
		$('#loaderBox').show();
		const data = $(`#${otpboxformid}`).serializeArray();
		let otp = "";
		const unitSizes = [];
		const unitPrices = [];
		const unitCategories = [];

		$(`#${otpboxformid} .bhk-list .unit.selected`).each(function () {
			const $this = $(this);
			const size = $this.data('unitsize') || "";
			const price = $this.attr('data-unitPrice') || "";
			const category = $this.data('unitcategory') || "";
			unitSizes.push(size.toString());
			unitPrices.push(price.toString());
			unitCategories.push(category.toString());
		});

		data.filter((v) => {
			if (v.name == 'otp_contactform') otp += v.value;
		});

		if (otp.length != 4) {
			helperJS.alertBox('error', '"otp" is not allowed to be empty');
			$('#loaderBox').hide();
			return false;
		}

		if ((formtype == 'PROJECT' || formtype == 'LISTING') && otpboxformid == 'BoxOtp_common_gallery') {
			const eventName = { pageUrl: window.location.pathname, DeviceType: isMobileBrowser() ? "Mobile" : "Desktop", Browser: globalfn.getDeviceModel() };
			if (typeof _paq !== 'undefined') {
				if (window.location.pathname.includes('/rent/') || window.location.pathname.includes('/sale/')) {
					_paq.push(['trackEvent', ltype == 'Rent' ? 'rental_dse' : 'resale_dse', 'Listing_Gallery_LeadForm', JSON.stringify(eventName)]);
				} else {
					_paq.push(['trackEvent', formtype == 'PROJECT' ? 'newProject_Detail' : 'Listing_Detail',
						formtype == 'PROJECT' ? 'Project_Detail_Gallery_LeadForm' : 'Listing_Detail_Gallery_LeadForm', JSON.stringify(eventName)]);
				}
			}
		}

		globalconfirmOtp(otp, formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, pageCategory, isdsepage, building_id, iscommonleadform, formtype, listingtype, unitSizes, unitPrices, unitCategories,loadviewinpopup);
	});

	$(`#${otpboxformid} #changeNumber_contactform`).off("click");
	$(`#${otpboxformid} #changeNumber_contactform`).on("click", () => {
		$(".homePageLeadFormOverLay .homeFormBox h3").text('Enter Your Mobile Number');
		$(`#${formboxid}`).addClass("active");
		$(`#${formboxid}`).addClass("changenumber");

		if (isdsepage == true) {
			$(`#${formid}`).addClass("active");
			$(`#${otpboxformid}`).removeClass("active");
			$(`#${changeNumberformid}`).addClass("active");
			$(`#${modalpopupid}`).removeClass("active");
		}

		if (iscommonleadform == true) {
			$(`#${formid}`).removeClass("active");
			$(`#${otpboxformid}`).removeClass("active");
			$(`#${formid}_heading,#dev_home_propertytabbox`).show();
			$(`#${formid}_heading strong`).text(helperJS.translate("Enter Your Mobile Number"));
			$(`#${changeNumberformid}`).addClass("active");
		}
	});

	const closeHandler = function () {
		if (typeof formid != 'undefined' && formid && formid == 'ClientInfoForm_Didemo_projectpopup') {
			if (typeof closeDiDemoPopup !== 'undefined' && typeof closeDiDemoPopup === "function") closeDiDemoPopup();
			return false;
		}
		resetCommonLeadForm(formid, otpboxformid, changeNumberformid, formtype, true);
		$('body').removeClass('active scroll-lock');
		if (formid == "ClientInfoForm_pricehistoryunlock") currentButtonClickDI = '';
		if ($('.mobileOurServices').hasClass('partialActive')) {
			$('.mobileOurServices').addClass('active').removeClass('partialActive');
			$('.globalOverflow,#mobileOurServicesLi').addClass('active'); $('body').addClass('scroll-lock');
		}
	};

	$(`#${formid}_formbox`).find(".closeButton").on("click", closeHandler);
  
	$(document).on("keydown.closeFormBackspace", (e) => {
		if (e.key === "Backspace" || e.keyCode === 8) {
			if (!$(e.target).is("input, textarea")) {
				e.preventDefault();
				closeHandler();
			}
		}
	});
};

const showFilledLeadForOtherForms = (_mformid, _userData, _currentformid) => {
	let isEmailLoggedIn = false;
    if(typeof _userData != 'undefined' && _userData.email && !_userData.mobile && !_userData.countryCode){
    	isEmailLoggedIn = true;
    }
	let selectorformids = `form.syForm.registerBox[id!='${_mformid}']`;
	if (typeof _currentformid != 'undefined' && _currentformid != undefined && _currentformid != null && _currentformid != "") {
		selectorformids = `form.syForm.registerBox#${_currentformid}`;
	}
	$(selectorformids).each(function () {
		const otherformid = $(this).attr("id");
		const info = $(`#${otherformid}_info`).length ? JSON.parse($(`#${otherformid}_info`).val()) : {};
		const formaction = $(`#${otherformid}_formaction`).val();
		const formname = $(`#${otherformid} #dev_formname`).val();
		const formactiontext = formaction == 'whatsapp' ? 'chat' : 'connect';
		const pageCategory = $(`#${otherformid} input[name='pageCategory']`).val();
		let formactionbtntext = formaction == 'whatsapp' ? 'Chat Now' : (pageCategory == 'COMPARE' ? 'Download Now' : 'Contact Now');

		let formPropamcText = '';
		if (typeof pageCategory != 'undefined' && (pageCategory == 'PROPAMC' || pageCategory == 'propamcProject' || pageCategory == "detailPages" || pageCategory == 'PROPAMCSUBSCRIBE')) {
			formactionbtntext = "Submit Now";
			formPropamcText = `I'm intersted in checking the price history for ${(info.name != '' ? info.name : (info.location != '' ? info.location : ''))} using the following phone number`;
		}
		if (typeof pageCategory != 'undefined' && pageCategory == "brochureDownload") {
			formactionbtntext = "Download Brochure";
		} else if (typeof pageCategory != 'undefined' && pageCategory == "masterPlanDownload") {
			formactionbtntext = "Download Master Plan";
		} else if (typeof pageCategory != 'undefined' && pageCategory == "videoDownload") {
			formactionbtntext = "Watch Video";
		} else if (typeof pageCategory != 'undefined' && pageCategory == "paymentPlanDownload") {
			formactionbtntext = "Download Payment Plan";
		} else if (typeof pageCategory != 'undefined' && pageCategory == "allDownload") {
			formactionbtntext = "Get All Downloads";
		} else if ((typeof pageCategory != 'undefined' && (pageCategory == 'New_Property_Rates' || pageCategory == 'Locality_Overview')) || (typeof formname != 'undefined' && formname == 'ReraProjectDetail')) {
			formactionbtntext = "Download";
		}

		$(`#${otherformid}_filledLeadBox`).find(".dev_filledleadbtn").text(helperJS.translate(formactionbtntext));

		if (formaction == "whatsapp") {
			$(`#${otherformid}_heading em`).removeClass("call");
			$(`#${otherformid}_heading em`).addClass("whatsapp");
		} else {
			$(`#${otherformid}_heading em`).removeClass("whatsapp");
			$(`#${otherformid}_heading em`).addClass("call");
		}
		if (typeof pageCategory != 'undefined' && pageCategory == 'PROPAMCSUBSCRIBE') {
			$(`#${otherformid}_heading strong`).text("Verify to subscribe");
		} else {
			$(`#${otherformid}_heading strong`).text($(`#${otherformid}_oldformheading`).text());
		}

		let agenttext = "our Real Estate Expert";
		if ($(`#${otherformid}_formbox .userInfoBox .nameWithStar span`).length > 0) {
			agenttext = $(`#${otherformid}_formbox .userInfoBox .nameWithStar span`).text();
		}

		let infotext = '';
		if (info.name != "") {
			infotext = ` for ${info.name ? info.name : "Property Search"}`;
		}

		if (typeof pageCategory != 'undefined' && pageCategory == 'shortlist_enquiry') {
			let selectedfavTab = helperJS.getLocalItem('selected_fav_tab') || "";
			if(selectedfavTab!=""){
				selectedfavTab = selectedfavTab.type;
				const favCheck = (selectedfavTab == "PROJECT") ? "checkedFavs" : ((selectedfavTab =="RESALE") ? 'resale_checkedFavs' : 'rental_checkedFavs'  )
				const checkList = helperJS.getLocalItem(favCheck) || "";
				if(checkList!="" && checkList.length>1){
					infotext = ` for Selected Properties`;
				}
			}
		}

		let filledleadhtml = `<p class="generateDescription">${helperJS.translate(pageCategory == "PROPAMCSUBSCRIBE" ? 'I Would like to subscribe for data intelligence seervices by Square Yards using the following number' : (pageCategory == 'PROPAMC' || pageCategory == 'detailPages') ? formPropamcText : `Hi #username, Would you like to ${formactiontext} with ${agenttext + infotext}`).replace('#username', _userData.userName ? _userData.userName : _userData.mobile ? _userData.mobile : '')}</p>`;

		if (typeof pageCategory != 'undefined' && pageCategory == 'commonBanner') {
			filledleadhtml = `<p class="generateDescription">Hi ${(_userData.userName != '' ? _userData.userName : (_userData.mobile != '' ? _userData.mobile : ''))}, Need more details? Our experts are here to help!</p>`;
		}

		if (typeof pageCategory != 'undefined' && pageCategory == 'COMPARE') {
			filledleadhtml = `<p class="generateDescription">Hi ${(_userData.userName != '' ? _userData.userName : (_userData.mobile != '' ? _userData.mobile : ''))},  Would you like to download the Comparative Market analysis of the selected properties ?</p>`;
		}

		if (typeof pageCategory != 'undefined' && pageCategory == 'New_Property_Rates') {
			const displayName = _userData.userName || _userData.mobile || '';
			const initial = displayName.charAt(0).toUpperCase();
			filledleadhtml = `<div class="dounload-user sy-fade-in one"><b class="user">${initial}</b><p><strong>Welcome back, ${displayName}!</strong>Your report is ready for instant download</p></div>`;
		}

		if (typeof pageCategory != 'undefined' && pageCategory == 'brochureDownload') {
			const displayName = _userData.userName || _userData.mobile || '';
			const projectName = info.name || 'this project';
			filledleadhtml = `<p class="generateDescription">Hi ${displayName}, your brochure for ${projectName} is ready. You can download it now and our Real Estate Expert may connect with you to assist with project details, pricing, and availability.</p>`;
		}

		if (typeof pageCategory != 'undefined' && pageCategory == 'masterPlanDownload') {
			const displayName = _userData.userName || _userData.mobile || '';
			const projectName = info.name || 'this project';
			filledleadhtml = `<p class="generateDescription">Hi ${displayName}, the master plan for ${projectName} is ready. You can download it now to explore the project layout, tower placement, open spaces, and overall site planning.</p>`;
		}

		if (typeof pageCategory != 'undefined' && pageCategory == 'videoDownload') {
			const displayName = _userData.userName || _userData.mobile || '';
			const projectName = info.name || 'this project';
			filledleadhtml = `<p class="generateDescription">Hi ${displayName}, the walkthrough video for ${projectName} are ready. You can watch it now to get a better view of the project, amenities, layout, and overall property experience.</p>`;
		}

		if (typeof pageCategory != 'undefined' && pageCategory == 'paymentPlanDownload') {
			const displayName = _userData.userName || _userData.mobile || '';
			const projectName = info.name || 'this project';
			filledleadhtml = `<p class="generateDescription">Hi ${displayName}, the payment plan for ${projectName} is ready. You can download it now to view the cost sheet and payment schedule.</p>`;
		}

		if (typeof pageCategory != 'undefined' && pageCategory == 'allDownload') {
			const displayName = _userData.userName || _userData.mobile || '';
			const projectName = info.name || 'this project';
			filledleadhtml = `<p class="generateDescription">Hi ${displayName}, all available downloads for ${projectName} are ready. You can access the brochure, master plan, and walkthrough video in one place.</p>`;
		}


		if (typeof pageCategory != 'undefined' && pageCategory == 'masterPlanDownload') {
			const displayName = _userData.userName || _userData.mobile || '';
			const projectName = info.name || 'this project';
			filledleadhtml = `<p class="generateDescription">Hi ${displayName}, the master plan for ${projectName} is ready. You can download it now to explore the project layout, tower placement, open spaces, and overall site planning.</p>`;
		}

		$(`#${otherformid}_alreadyLead`).find(".generateInfoBox").html(filledleadhtml);

		const isRepeatUserRecognized = (typeof info.isBranded != 'undefined' && info.isBranded == 1 && $(`#${otherformid} input[name='propertyType']`).length > 0 && $(`#${otherformid} input[name='propertyType']`).val().toLowerCase() == 'pg') == false && typeof _userData != 'undefined' && _userData && _userData.countryCode && _userData.mobile;

		if (isRepeatUserRecognized && typeof pageCategory != 'undefined' && pageCategory == 'New_Property_Rates') {
			$(this).removeClass("active");
			$(`#${otherformid}_alreadyLead`).addClass("active");
		}

		$(`#${otherformid} #name`).val(_userData.userName);
		$(`#${otherformid} #name`).attr("value", _userData.userName);
		$(`#${otherformid} #email`).val(_userData.email);
		$(`#${otherformid} #email`).attr("value", _userData.email);

		if(isEmailLoggedIn){
			$(`#${otherformid} #email`).attr("disabled","disabled");
		}else{
			$(`#${otherformid} #email`).removeAttr("disabled");
		}

		if (typeof _userData != 'undefined' && _userData.countryCode) {
			$(`#${otherformid} #ddlCountryCode`).val(_userData.countryCode);
		}

		$(`#${otherformid} #mobile`).val(_userData.mobile);
		$(`#${otherformid} #mobile`).attr("value", _userData.mobile);

		if (isRepeatUserRecognized && (typeof pageCategory == 'undefined' || pageCategory != 'New_Property_Rates')) {
			$(`#${otherformid} #name`).closest(".form-input").addClass("fill-data");
			if (!isEmailLoggedIn) {
				$(`#${otherformid} #email`).closest(".form-input").addClass("fill-data");
			}
			$(`#${otherformid} #mobile`).closest(".input-group").addClass("fill-data");
		}

		$(".filledLeadBox .generateEditBtn").off("click");
		$(".filledLeadBox .generateEditBtn").on("click", function () {
			const currentformid = $(this).attr("formid");
			$(`#${currentformid}`).addClass("active");
			$(`#${currentformid}_alreadyLead`).removeClass("active");
			$(`#${currentformid}_formbody`).show();
			$(`#${currentformid}_heading strong`).show();

			fillLeadForm(currentformid);
		});

		$(document).off("click", ".fill-data .input-icon");
		$(document).on("click", ".fill-data .input-icon", function () {
			$(this).closest(".fill-data").removeClass("fill-data");
			$(this).siblings(".form-control, select, input").first().trigger("focus");
		});
	});
};

const globalconfirmotpcallback = (otp, formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, pageCategory, isdsepage, builderid, iscommonleadform, formtype, listingtype ,response, countryCodeVal, unitSizes = [], unitPrices = [], unitCategories = [], loadviewinpopup, submitMode) => {
	$('#loaderBox').show();
	const mobile = $(`#${formid} input[name='mobile']`).val();
	let countryCode = $(`#${formid} select[name='countryCode']`).val();
	if (countryCode == null) countryCode = countryCodeVal;
	const name = $(`#${formid} input[name='name']`).val();
	const email = $(`#${formid} input[name='email']`).val();
	let location = $(`#${formid} select[name='location']`).val();
	let propertyId = $(`#${formid}`).find('input[name="DotcomProjectId"]').val();
	const priceHistorPage = $(`#${formboxid} input[name='pricehistoryType']`).val();
	const listingUrlPropAmc = $(`#${formboxid} input[name='listingUrl']`).val();
	const type = $(`#${formboxid} input[name='type']`).val();
	const sharerId = $(`#${formid} input[name='SharerId']`).val();
	const sharerType = $(`#${formid} input[name='SharerType']`).val();
	let whatsappOptn = !!$(`#${otpboxformid} input[name='whatsapp_check']:checked`).length;
	if ($(`#${formid} #formaction`).val() && $(`#${formid} #formaction`).val().toLowerCase() == 'whatsapp') whatsappOptn = true;
	const isWhatsApp = Boolean($(`#${formid} #formaction`).val() && $(`#${formid} #formaction`).val().toLowerCase() == 'whatsapp');

	let propertyTitle = "";
	propertyId = (propertyId != undefined && propertyId != null && propertyId != "") ? propertyId	 : 0;
	let user = 0;
	let userType = "";
	let DotcomProjectId = "";
	let userName = "";
	let subLocalityName = "";
	let area = "";
	let unitType = "";
	let propertyType = "";
	let projectName = "";
	let prjsublocation = "";
	let prjcity = "";
	let prjdeveloper = "";
	let prjsize = "";
	let prjprice = "";
	let prjarea = "";
	let minarea = "";
	let maxarea = "";
	let lowcost = "";
	let highcost = "";
	let price = "";
	let cityId = "";
	let subLocationId = "";

	if (formtype == "LISTING") {
		propertyTitle = $(`#${formid} input#formPropertyTitle`).val();
		location = $(`#${formid} input#formLocation`).val();
		propertyId = $(`#${formid} input#formPropertyId`).val();
		user = $(`#${formid} input#formUserId`).val();
		userType = $(`#${formid} input#formUserTypeId`).val();
		userName = $(`#${formid} input#formUserName`).val();
		subLocalityName = $(`#${formid} input#formsubLocalityName`).val();
		area = $(`#${formid} input#formarea`).val();
		unitType = $(`#${formid} input#formunitType`).val();
		propertyType = $(`#${formid} input#formpropertyType`).val();
		projectName = $(`#${formid} input#formprojectName`).val();
		prjprice = $(`#${formid} input#formtotalPrice`).val();
		price = $(`#${formid} input#formprice`).val();
		cityId = $(`#${formid} input#formCityId`).val();
		subLocationId = $(`#${formid} input#formSublocationId`).val();
	}

	if ((typeof response.status != 'undefined' && response.status != 0) || (typeof response.Status != 'undefined' && response.Status != 0)) {
		if (typeof response.reraToken != 'undefined' && response.reraToken && typeof reraDetails != 'undefined') reraDetails.reraToken = response.reraToken;
		globalfn.setUserHeaderMenu();
	}

	if (formtype == "PROJECT") {
		DotcomProjectId = $(`#${formid} input#DotcomProjectId`).val();
		projectName = $(`#${formid} input#projectName`).val();
		prjsublocation = $(`#${formid} input#prjsublocation`).val();
		prjcity = $(`#${formid} input#prjcity`).val();
		prjdeveloper = $(`#${formid} input#prjdeveloper`).val();
		prjsize = $(`#${formid} input#prjsize`).val();
		prjprice = $(`#${formid} input#prjprice`).val();
		prjarea = $(`#${formid} input#prjarea`).val();
		minarea = $(`#${formid} input#prjminarea`).val();
		maxarea = $(`#${formid} input#prjmaxarea`).val();
		lowcost = $(`#${formid} input#prjlowcost`).val();
		highcost = $(`#${formid} input#prjhighcost`).val();
		cityId = $(`#${formid} input#prjcityId`).val();
		location = $(`#${formid} input#prjcity`).val();
		subLocationId = $(`#${formid} input#prjsubLocationId`).val();
	}

	if (formtype == "AGENT") {
		user = $(`#${formid} input#formUserId`).val();
		userType = $(`#${formid} input#formUserTypeId`).val();
		userName = $(`#${formid} input#formUserName`).val();
	}
	let rescondition = response.redirectUrl || response.status == 1;
	if (formtype == "homeloan" || formtype == "homeinterior" || formtype == "Home_Interior" || formtype == "DIDEMO") {
		rescondition = response.status || response.Status;
	}

	if (rescondition) {
		// dataLayerOnly GA4 mirror — the SERVER emits the authoritative lead_verified
		if (window.syPulse) {
			const _syFname = getSyFormPlacement(formid, pageCategory, formboxid);
			// A form fill is a `call` lead whatever CTA opened it — a WhatsApp lead never reaches the
			// OTP flow at all (it redirects straight to WhatsApp and emits whatsapp_redirect).
			const _syWa = false;
			window.syPulse.track('lead_verified', { form_placement: _syFname, form_box_id: formboxid || '', form_type: formtype || '', lead_type: _syWa ? 'whatsapp' : 'call', submit_mode: submitMode || 'full_form' }, { dataLayerOnly: true });
			if (response.sy_user_key && window.syPulse.setUserKey) window.syPulse.setUserKey(response.sy_user_key);
		}
		let dLayer_pagetype = '';
		if (typeof (dataLayer) != "undefined") {
			for (let i = 0; i < dataLayer.length; i++) {
				if (dataLayer[i].PageType) {
					dLayer_pagetype = dataLayer[i].PageType;
					break;
				}
			}
		}
		let dsePagetype = '';
		dsePagetype = dLayer_pagetype;
		let eventName = {};
		if (dLayer_pagetype == "Transaction") {
			const listingUrl = $("#listingUrl").val();
			const projectlocation = $(`#${formid}`).find('input[name="projectlocation"]').val();
			const projectName = $(`#${formid}`).find('input[name="projectName"]').val();
			const projectcity = $(`#${formid}`).find('input[name="projectcity"]').val();
			const pCityId = $(`#${formid}`).find('input[name="cityId"]').val();
			const psublocationId = $(`#${formid}`).find('input[name="sublocationId"]').val();
			eventName = {
				listingUrl: baseUrl + listingUrl,
				source: propertyId,
				projectLocation: projectlocation,
				projectName,
				enquiryType: '',
				type: "",
				projectCity: projectcity,
				name,
				emailId: email,
				mobile: `${countryCode}${response.encr}`,
				city: location,
				cityId: pCityId,
				subLocationId: psublocationId,
				status: 'OTP verified',
				googleId: (helperJS.getCookie('_ga')) || '',
				url: window.location.href
					  };
		} else {
			if (formtype == "LISTING") {
				eventName = {
					name,
					emailId: email,
					mobile: `${countryCode}${response.encr}`,
					cityId,
					subLocationId: [`${subLocationId}`],
					type: "",
					propertyId,
					agentId: user,
					agentName: userName,
					pageType: dLayer_pagetype,
					status: 'OTP verified',
					googleId: (helperJS.getCookie('_ga')) || '',
					url: window.location.href
				};
			} else if (formtype == "PROJECT") {
				eventName = {
					name,
					emailId: email,
					mobile: `${countryCode}${response.encr}`,
					cityId,
					subLocationId: [`${subLocationId}`],
					type: 'New Projects',
					projectId: DotcomProjectId,
					projectName,
					pageType: dLayer_pagetype,
					status: 'OTP verified',
					googleId: (helperJS.getCookie('_ga')) || '',
					url: window.location.href
				};
			} else {
				eventName = {
					name,
					emailId: email,
					mobile: `${countryCode}${response.encr}`,
					city: location,
					type: "",
					projectId: propertyId,
					pageType: dLayer_pagetype,
					status: 'OTP verified',
					googleId: (helperJS.getCookie('_ga')) || '',
					url: window.location.href
				};
			}
			if (typeof dLayer_pagetype != 'undefined' && dLayer_pagetype != '') {
				if (dLayer_pagetype == "LISTINGRESALE") {
					eventName.type = 'Resale';
				} else if (dLayer_pagetype == "LISTINGRENTAL") {
					eventName.type = 'Rental';
				} else if (dLayer_pagetype == "AGENT_DETAIL") {
					eventName.type = 'Agents';
				} else if (dLayer_pagetype == "AGENT_LISTING") {
					eventName.type = 'Agents';
				} else if (dLayer_pagetype == "LISTINGRESALEDETAIL") {
					eventName.type = 'Resale';
				} else if (dLayer_pagetype == "LISTINGRENTALDETAIL") {
					eventName.type = 'Rental';
				} else if (dLayer_pagetype == 'AGENT_DSE') {
					eventName.type = 'Agents';
				} else if (dLayer_pagetype == 'SALE_DSE') {
					eventName.type = 'Resale';
				} else if (dLayer_pagetype == 'RENT_DSE') {
					eventName.type = 'Rental';
				} else if (dLayer_pagetype == 'PROPAMC') {
					eventName.type = 'DIUnlock';
				} else if (dLayer_pagetype == 'PROPAMCSUBSCRIBE') {
					eventName.type = 'DISubscribe ';
				} else if (dLayer_pagetype == 'RECOMMENDATIONRESALELISTING' && pageCategory == 'RECOMMENDATIONRESALELISTING') {
					eventName.type = 'Resale';
				} else if (dLayer_pagetype == 'RECOMMENDATIONRENTALLISTING' && pageCategory == 'RECOMMENDATIONRENTALLISTING') {
					eventName.type = 'Rental';
				} else {
					eventName.type = 'New Projects';
				}
			}
		}

		const propAmcData = response.propamcdata;
		const PriceHisoryPageData = response.PriceHisoryPageData;
		const beatsresponse = response.beatsapires;
		const propamcApiTicketResponse = response.propamcApiTicketResponse;
		const propamcCommonTicketResponse = response.propamcCommonTicketResponse || {};
		const apiResp = response.apiResp;
		const apiResp_agentdata = response.data;
		const reviewId = response.reviewId || {};
		const beatsapires_selling = response.beatsapires_selling || {};
		const homeloanapires = response.homeloanapires || {};
		const interiorapires = response.interiorapires || {};
		const compareResp = response.compareResp || "";
		const interiorEstimateResp = response.interiorEstimateResp || {};

		const _userData = response._userData;

		if (iscommonleadform == true && _userData != undefined && pageCategory != 'movers-packers' && pageCategory != 'rent-furniture' && pageCategory != 'rent-appliances' && pageCategory != 'vastu' && pageCategory != 'solar-rooftop' && pageCategory != 'property-inspection' && pageCategory != "painting-services" && pageCategory != "USERPREFERENCE" && pageCategory != "New_Project_Detail_DiDemo") {
			const info = $(`#${formid}_info`).length ? JSON.parse($(`#${formid}_info`).val()) : {};
			const formaction = $(`#${formid}_formaction`).val();
			const formactiontext = formaction == 'whatsapp' ? 'chat' : 'connect';
			let formactionbtntext = formaction == 'whatsapp' ? 'Chat Now' : 'Contact Now';

			const pageCategory = $(`#${formid} input[name='pageCategory']`).val();

			if (typeof pageCategory != 'undefined' && (pageCategory == 'PROPAMC' || pageCategory == 'propamcProject' || pageCategory == "detailPages")) {
				formactionbtntext = "Submit Now";
			}
			if (typeof pageCategory != 'undefined' && pageCategory == "brochureDownload") {
				formactionbtntext = "Download Brochure";
			} else if (typeof pageCategory != 'undefined' && pageCategory == "masterPlanDownload") {
				formactionbtntext = "Download Master Plan";
			} else if (typeof pageCategory != 'undefined' && pageCategory == "videoDownload") {
				formactionbtntext = "Watch Video";
			} else if (typeof pageCategory != 'undefined' && pageCategory == "paymentPlanDownload") {
				formactionbtntext = "Download Payment Plan";
			} else if (typeof pageCategory != 'undefined' && pageCategory == "allDownload") {
				formactionbtntext = "Get All Downloads";
			} else if ((typeof pageCategory != 'undefined' && pageCategory == 'New_Property_Rates') || (typeof formname != 'undefined' && formname == 'ReraProjectDetail')) {
				formactionbtntext = "Download";
			}

			const isRepeatUserRecognized = (typeof info.isBranded != 'undefined' && info.isBranded == 1 && $(`#${formid} input[name='propertyType']`).length > 0 && $(`#${formid} input[name='propertyType']`).val().toLowerCase() == 'pg') == false && typeof _userData != 'undefined' && _userData && _userData.countryCode && _userData.mobile;

			$(`#${formid}_filledLeadBox`).find(".dev_filledleadbtn").text(formactionbtntext);

			if (formaction == "whatsapp") {
				$(`#${formid}_heading em`).removeClass("call");
				$(`#${formid}_heading em`).addClass("whatsapp");
			} else {
				$(`#${formid}_heading em`).removeClass("whatsapp");
				$(`#${formid}_heading em`).addClass("call");
			}

			$(`#${formid}_heading strong`).text($(`#${formid}_oldformheading`).text());

			let agenttext = "our Real Estate Expert";
			if ($(`#${formid}_formbox .userInfoBox .nameWithStar span`).length > 0) {
				agenttext = $(`#${formid}_formbox .userInfoBox .nameWithStar span`).text();
			}

			let infotext = '';
			if (info.name != "") {
				infotext = ` for ${info.name}`;
			}
			const filledleadhtml = `${'<p class="generateDescription">'
			+ 'Would you like to '}${formactiontext} with ${agenttext}${infotext} using `
			+ `the following phone number:</p>`
			+ `<div class="generateNumberBox">`
			+ `<div class="generateNumber">`
			+ `<em class="leadformIco"></em>${_userData.countryCode}-${_userData.mobile
			}<button class="generateEditBtn" formid="${formid}">Edit</button></div></div>`;

			$(`#${formid}_alreadyLead`).find(".generateInfoBox").html(filledleadhtml);
			if (isRepeatUserRecognized && typeof pageCategory != 'undefined' && pageCategory == 'New_Property_Rates') {
				$(`#${formid}_alreadyLead`).addClass("active");
			}

			$(`#${formid}_leadForm`).addClass("active");

			$(`#${formid} #name`).val(_userData.userName);
			$(`#${formid} #name`).attr("value", _userData.userName);
			$(`#${formid} #email`).val(_userData.email);
			$(`#${formid} #email`).attr("value", _userData.email);

			if (typeof _userData != 'undefined' && _userData.countryCode) {
				$(`#${formid} #ddlCountryCode`).val(_userData.countryCode);
			}
			$(`#${formid} #mobile`).val(_userData.mobile);
			$(`#${formid} #mobile`).attr("value", _userData.mobile);

			if (isRepeatUserRecognized && (typeof pageCategory == 'undefined' || pageCategory != 'New_Property_Rates')) {
				$(`#${formid} #name`).closest(".form-input").addClass("fill-data");
				$(`#${formid} #email`).closest(".form-input").addClass("fill-data");
				$(`#${formid} #mobile`).closest(".input-group").addClass("fill-data");
			}

			$(".filledLeadBox .generateEditBtn").off("click");
			$(".filledLeadBox .generateEditBtn").on("click", () => {
				$(`#${formid}`).addClass("active");
				$(`#${formid}_alreadyLead`).removeClass("active");
				$(`#${formid}_formbody`).show();
				$(`#${formid}_heading,#dev_home_propertytabbox`).show();
			});

			resetCommonLeadForm(formid, otpboxformid, changeNumberformid, formtype);

			if (pageCategory != 'movers-packers' || pageCategory != 'rent-furniture' || pageCategory != 'rent-appliances' || pageCategory != 'vastu' || pageCategory != 'solar-rooftop' || pageCategory != 'property-inspection' || pageCategory != "painting-services" || pageCategory != 'New_Project_Detail_DiDemo') {
				showFilledLeadForOtherForms(formid, _userData);
			}
		}

		if (formtype == "LISTING") {
			let leadId = 0;
			if (apiResp && apiResp[0] && parseInt(apiResp[0].leadId)) {
				leadId = parseInt(apiResp[0].leadId);
			}

			if (leadId == -3) {
				helperJS.alertBox('error', response.message);
				$('#loaderBox').hide();
			} else if (apiResp != undefined && apiResp.length != undefined && apiResp.length == 0) {
				helperJS.alertBox('error', "something went wrong");
				$('#loaderBox').hide();
			} else if (apiResp != undefined && apiResp[0] && apiResp[0].status == 1) {
				afterglobalVerification(countryCode, mobile, beatsresponse, pageCategory, formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, response.redirectUrl, isdsepage, propAmcData, type, PriceHisoryPageData, iscommonleadform, _userData, formtype, apiResp, apiResp_agentdata, propamcCommonTicketResponse, propertyId, dsePagetype, loadviewinpopup);
				if (eventName.name && eventName.mobile) {
					if (typeof _paq != 'undefined') {
						_paq.push(['trackEvent', 'product', 'enquired', JSON.stringify(eventName)]);
						if (pageCategory == 'RECOMMENDATIONRESALELISTING' || pageCategory == 'RECOMMENDATIONRENTALLISTING' || pageCategory == 'RECOMMENDATIONNEWPROJECTLISTING') {
							const eventCategory = ["Resale", "Rental"].includes(eventName.type) ? `recommendation_${eventName.type.toLowerCase()}` : "recommendation_newProject";
							const eventAction = isWhatsApp ? "whatsapp_form_submitted" : "get_a_callback_form_submitted";
							_paq.push(['trackEvent', eventCategory, eventAction, JSON.stringify(eventName)]);
						}
					}
					$(`#${modalpopupid}`).addClass('active');
				}
			} else {
				if (apiResp != undefined && typeof response.message != 'undefined' && response.message != null && response.message != undefined && response.message != "") {
					if (iscommonleadform == true && response.message.toLowerCase().indexOf("exhausted your attempts") != -1) {
						showExhaustLimitPopUp(formid, otpboxformid, changeNumberformid, formtype);
					} else {
						helperJS.alertBox('error', response.message);
					}
				} else {
					helperJS.alertBox('error', "something went wrong");
				}
				$('#loaderBox').hide();
			}
		} else if (formtype == "AGENT") {
			let leadId = 0;
			if (apiResp && apiResp[0] && parseInt(apiResp[0].leadId)) {
				leadId = parseInt(apiResp[0].leadId);
			}

			if (leadId == -3) {
				helperJS.alertBox('error', response.message);
				$('#loaderBox').hide();
			} else if (apiResp != undefined && apiResp.length != undefined && apiResp.length == 0) {
				helperJS.alertBox('error', "something went wrong");
				$('#loaderBox').hide();
			} else if (apiResp != undefined && apiResp[0] && apiResp[0].status == 1) {
				afterglobalVerification(countryCode, mobile, beatsresponse, pageCategory, formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, response.redirectUrl, isdsepage, propAmcData, type, PriceHisoryPageData, iscommonleadform, _userData, formtype, apiResp, apiResp_agentdata, propamcCommonTicketResponse,DotcomProjectId, '', loadviewinpopup);
				if (eventName.name && eventName.emailId && eventName.mobile) {
					if (typeof _paq != 'undefined') {
						_paq.push(['trackEvent', 'product', 'enquired', JSON.stringify(eventName)]);
					}
					$(`#${modalpopupid}`).addClass('active');
				}
			} else {
				if (apiResp != undefined && typeof response.message != 'undefined' && response.message != null && response.message != undefined && response.message != "") {
					if (iscommonleadform == true && response.message.toLowerCase().indexOf("exhausted your attempts") != -1) {
						showExhaustLimitPopUp(formid, otpboxformid, changeNumberformid, formtype);
					} else {
						helperJS.alertBox('error', response.message);
					}
				} else {
					helperJS.alertBox('error', "something went wrong");
				}
				$('#loaderBox').hide();
			}
		} else if (pageCategory == "USERPREFERENCE") {
			$(`#${formid}_alreadyLead`).removeClass("active");
			if (response.status) {
				if (typeof resetSaveSearchPopup == 'function') resetSaveSearchPopup();
				$(".globalOverflow,#saveSearch").removeClass("active"); $("body").removeClass("active scroll-lock");
			}
			if (response.userPreferenceResponse && response.userPreferenceResponse.status) {
				helperJS.alertBox('success', response.userPreferenceResponse.message);
			} else {
				helperJS.alertBox('error', response.userPreferenceResponse ? response.userPreferenceResponse.message || '' : 'Something went Wrong');
			}
			$('#loaderBox').hide();
		} else if (formtype == "homeloan" || formtype == "homeinterior" || formtype == 'Home_Interior') {
			if(formtype == 'Home_Interior') {
				afterglobalVerification(countryCode, mobile, beatsresponse, pageCategory, formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, response.redirectUrl, isdsepage, {}, type, {}, iscommonleadform, _userData, formtype, apiResp, {}, {}, DotcomProjectId, '', loadviewinpopup, '', interiorEstimateResp);
			} else if (pageCategory == 'commonBanner') {
				afterglobalVerification(countryCode, mobile, {}, pageCategory, formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, response.redirectUrl, isdsepage, {}, type, {}, iscommonleadform, _userData, formtype, {}, {}, {}, DotcomProjectId, '', loadviewinpopup);
			} else {
				helperJS.alertBox('success', 'Thank you for showing your interest, One of our representative will get in touch with you shortly.');
			}
			$('#loaderBox').hide();
		} else if (beatsresponse != undefined && beatsresponse.length != undefined && beatsresponse.length == 0) {
			helperJS.alertBox('error', "something went wrong");
			$('#loaderBox').hide();
		} else if (pageCategory != 'undefined' && pageCategory != '' && pageCategory == 'sqy-reviewpage') {
			if (typeof reviewId != 'undefined' && reviewId.status) {
				$("#dev_listingform_review_popup").html(dev_Modal_ReviewBox);
				$('#loaderBox').hide();
			} else {
				helperJS.alertBox('error', "something went wrong");
				$('#loaderBox').hide();
			}
		} else {
			if (typeof pageCategory != 'undefined' && pageCategory == 'New_Project_Detail_DiDemo') {
				$('#loaderBox').hide();
				closeDiDemoPopup();
				helperJS.alertBox('success', 'Thank you for showing your interest, One of our representative will get in touch with you shortly.');
				return false;
			}
			if (typeof pageCategory != 'undefined' && pageCategory == 'brochureDownload' && $('#hd_brochure').length) {
				const brochureUrl = ($('#hd_brochure').val() || '') ? atob($('#hd_brochure').val()) : '';
				const downloadLink = document.createElement("a");
				const fileName = "projectBrochure.pdf";
				downloadLink.href = brochureUrl;
				downloadLink.download = fileName;
				downloadLink.target = "_blank";
				downloadLink.click();
				$('#loaderBox').hide();
				return false;
			}

			function downloadFileWithFallback(urls, filePrefix, ext) {
				return new Promise(function (resolve) {
					try {
						if (!Array.isArray(urls)) {
							urls = (urls || '').split(',');
						}
						urls.forEach(function (u, i) {
							let finalUrl = (u || '').trim();
							if (!finalUrl) return;
							if (!/^https?:\/\//.test(finalUrl) && ext === 'jpg') {
								finalUrl = 'https://static.squareyards.com/' + finalUrl;
							}
							setTimeout(function () {
								try {
									const a = document.createElement('a');
									a.href = finalUrl;
									a.target = '_blank';
									a.rel = 'noopener';

									if ('download' in a) {
										a.download = filePrefix + '-' + (i + 1) + '.' + ext;
									}

									document.body.appendChild(a);
									a.click();
									a.remove();
								} catch (err) {
									console.log('Inner error:', err);
									window.open(finalUrl, '_blank');
								}
							}, i * 400);
						});
						setTimeout(function () {
							resolve();
						}, urls.length * 400 + 500);

					} catch (e) {
						console.log('Download error:', e);
						resolve();
					}
				});
			}

			if (pageCategory === 'masterPlanDownload' && $('#hd_masterPlan').length) {
				downloadFileWithFallback($('#hd_masterPlan').val(), 'master-plan', 'jpg')
					.then(function () {
						$('#loaderBox').hide();
					});
				return false;
			}

			if (pageCategory === 'videoDownload' && $('#hd_videoDownload').length) {
				 downloadFileWithFallback($('#hd_videoDownload').val(), 'project-video', 'mp4')
					.then(function () {
						$('#loaderBox').hide();
					});
				return false;
			}

			if (pageCategory === 'paymentPlanDownload' && $('#hd_paymentPlan').length) {
				downloadFileWithFallback($('#hd_paymentPlan').val(), 'payment-plan', 'pdf')
					.then(function () {
						$('#loaderBox').hide();
					});
				return false;
			}

			if ((pageCategory === 'New_Property_Rates' && $('#hd_localityReport').length) || (pageCategory === 'Locality_Overview' && $('#hd_localityReport').length)) {
				 downloadFileWithFallback($('#hd_localityReport').val(), 'locality-report', 'pdf')
					.then(function () {
						$('#loaderBox').hide();
						$('.modal-overlay').removeClass('active');
						$('.modal.modal-bottom.pr-modal').removeClass('active');
					});
				return false;
			}

			function downloadReraFile(docId) {
				return new Promise(function (resolve) {
					if (!docId) return resolve();
					$.ajax({
						type: 'POST',
						contentType: 'application/json',
						data: JSON.stringify({ docId }),
						url: '/download-rera-file',
						success(data) {
							if (data && data.status && data.pdfData) {
								const ext = (data.ext || 'pdf').toLowerCase();
								const mimeMap = { pdf: 'application/pdf', html: 'text/html', htm: 'text/html' };
								const byteChars = atob(data.pdfData);
								const byteNumbers = new Array(byteChars.length);
								for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
								const blob = new Blob([new Uint8Array(byteNumbers)], { type: mimeMap[ext] || 'application/pdf' });
								const downloadLink = document.createElement('a');
								downloadLink.href = URL.createObjectURL(blob);
								downloadLink.download = 'rera-document.' + ext;
								downloadLink.click();
							} else {
								helperJS.alertBox('error', (data && data.message) || 'Please Try Later - Error Fetching Document');
							}
						},
						error() {
							helperJS.alertBox('error', 'Please Try Later - Error Fetching Document');
						},
						complete() {
							resolve();
						}
					});
				});
			}

			if (pageCategory === 'Rera_Detail_Page' && $('#hd_reraPdf').length) {
				downloadReraFile($('#hd_reraPdf').val() || '')
					.then(function () {
						$('#loaderBox').hide();
						$('#' + formid + '_leadForm,div.overLayBox,.globalOverflow').removeClass('active');
						$('body').removeClass('active scroll-lock');
					});
				return false;
			}

			if (pageCategory === 'allDownload' && ($('#hd_videoDownload').length || $('#hd_masterPlan').length || $('#hd_brochure').length)) {
				// 1. Brochure 
				if ($('#hd_brochure').length) {
					const brochureUrl = ($('#hd_brochure').val() || '') ? atob($('#hd_brochure').val()) : '';
					if (brochureUrl) {
						const a = document.createElement("a");
						a.href = brochureUrl;
						a.target = "_blank"; 
						document.body.appendChild(a); a.click(); a.remove();
					}
				}

				let promises = [];
				// 2. Master Plan
				if ($('#hd_masterPlan').length) {
					promises.push(downloadFileWithFallback($('#hd_masterPlan').val(), 'master-plan', 'jpg'));
				}

				// 3. Video 
				if ($('#hd_videoDownload').length) {
					promises.push(downloadFileWithFallback($('#hd_videoDownload').val(), 'project-video', 'mp4'));
				}

				Promise.all(promises).then(function () {
					$('#loaderBox').hide();
				});
				return false;
			}


			if (typeof pageCategory != 'undefined' && pageCategory == 'PROPSAMCCMSPDF' && $('#propsAmcPdf').length) {
				const pdfUrl = $('#propsAmcPdf').attr('pdfsrc');
				const downloadLink = document.createElement("a");
				const fileName = "projectInvestmentDeck.pdf";
				downloadLink.href = pdfUrl;
				downloadLink.download = fileName;
				downloadLink.target = "_blank";
				downloadLink.click();
				$('#loaderBox').hide();
				return false;
			}
			if (formboxid && formboxid == 'dev_propTV_form_sticky' && typeof _paq != 'undefined') {
				const actionName = `${projectName || ''}, ${location || ''}`;
				const propTvPayload = {
					source: 'dotcom'
				};
				_paq.push(['trackEvent', 'PropTv_Leads', actionName, JSON.stringify(propTvPayload)]);
			}
			if (beatsresponse == undefined && typeof propamcApiTicketResponse != 'undefined' && Object.keys(propamcApiTicketResponse).length) {
				afterVerificationPropamcResponse(otpboxformid, formboxid, changeNumberformid, formid);
				if (typeof _paq != 'undefined' && eventName.name && eventName.emailId && eventName.mobile) {
					_paq.push(['trackEvent', 'intelligence', 'DIenquiry', JSON.stringify(eventName)]);
				}
			} else if (beatsresponse != undefined && typeof beatsresponse.Status != 'undefined' && (beatsresponse.Status == 1 || (beatsresponse.Status == 0 && typeof beatsresponse.ContactId != 'undefined' && beatsresponse.ContactId > 0))) {
				afterglobalVerification(countryCode, mobile, beatsresponse, pageCategory, formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, response.redirectUrl, isdsepage, propAmcData, type, PriceHisoryPageData, iscommonleadform, _userData, formtype, apiResp, apiResp_agentdata, propamcCommonTicketResponse, DotcomProjectId, dsePagetype,loadviewinpopup, compareResp);
				if (eventName.name && eventName.mobile) {
					if (typeof _paq != 'undefined') {
						_paq.push(['trackEvent', 'product', 'enquired', JSON.stringify(eventName)]);
						if (pageCategory == 'RECOMMENDATIONRESALELISTING' || pageCategory == 'RECOMMENDATIONRENTALLISTING' || pageCategory == 'RECOMMENDATIONNEWPROJECTLISTING') {
							const eventCategory = ["Resale", "Rental"].includes(eventName.type) ? `recommendation_${eventName.type.toLowerCase()}` : "recommendation_newProject";
							const eventAction = isWhatsApp ? "whatsapp_form_submitted" : "get_a_callback_form_submitted";
							eventName.pageUrl = window.location.href;
							eventName.DeviceType = /android|iphone|ipad|ipod|blackberry|opera mini|iemobile|mobile/.test(navigator.userAgent.toLowerCase()) ? "Mobile" : "Desktop";
							_paq.push(['trackEvent', eventCategory, eventAction, JSON.stringify(eventName)]);
						}
					}
					$(`#${modalpopupid}`).addClass('active');
				}
			} else if (beatsapires_selling != undefined && typeof beatsapires_selling.Status != 'undefined' && (beatsapires_selling.Status == 1 || (beatsapires_selling.Status == 0 && typeof beatsapires_selling.ContactId != 'undefined' && beatsapires_selling.ContactId > 0))) {
				afterglobalVerification(countryCode, mobile, beatsapires_selling, pageCategory, formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, response.redirectUrl, isdsepage, propAmcData, type, PriceHisoryPageData, iscommonleadform, _userData, formtype, apiResp, apiResp_agentdata, propamcCommonTicketResponse, DotcomProjectId, dsePagetype, loadviewinpopup);
			} else if ((homeloanapires != undefined && typeof homeloanapires.status != 'undefined') || (interiorapires != undefined && typeof interiorapires.status != 'undefined')) {
				helperJS.alertBox('success', 'Thank you for showing your interest, One of our representative will get in touch with you shortly.');
				$('#loaderBox').hide();
			} else {
				if (beatsresponse != undefined && typeof beatsresponse.ErrorMessage != 'undefined' && beatsresponse.ErrorMessage != null && beatsresponse.ErrorMessage != undefined && beatsresponse.ErrorMessage != "") {
					// $("#" + otpboxformid + " .otpError").html(beatsresponse.ErrorMessage);

					if (iscommonleadform == true && beatsresponse.ErrorMessage.toLowerCase().indexOf("exhausted your attempts") != -1) {
						showExhaustLimitPopUp(formid, otpboxformid, changeNumberformid, formtype);
					} else {
						helperJS.alertBox('error', beatsresponse.ErrorMessage);
					}
				} else {
					helperJS.alertBox('error', "something went wrong");
					// $("#" + otpboxformid + " .otpError").html("something went wrong");
				}
				$('#loaderBox').hide();
			}
		}
	} else {
		// $("#" + otpboxformid + " .otpError").html(response.message);
		helperJS.alertBox('error', response.message);
		$('#loaderBox').hide();
		$('#BoxOtp_dsepopup input[name="otp_contactform"] ').val('');
		$('#BoxOtp_propamc input[name="otp_contactform"] ').val('');
		$('#BoxOtp input[name="otp_contactform"] ').val('');
		$('#BoxOtp1 input[name="otp_contactform"] ').val('');
		$(`#${formid} input[name='iswhatsappclick']`).attr("value", "0");
	}
};

const globalconfirmOtp = (otp, formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, pageCategory, isdsepage, builderid, iscommonleadform, formtype, listingtype, unitSizes, unitPrices, unitCategories,loadviewinpopup) => {
	$(`#${otpboxformid} .otpError`).html('');
	const mobile = $(`#${formid} input[name='mobile']`).val();
	const countryCode = $(`#${formid} select[name='countryCode']`).val();
	const name = $(`#${formid} input[name='name']`).val();
	const email = $(`#${formid} input[name='email']`).val();
	let location = $(`#${formid} select[name='location']`).val() || $(`#${formid} input#prjcity`).val();
	let propertyId = $(`#${formid}`).find('input[name="DotcomProjectId"]').val() || 0;
	const priceHistorPage = $(`#${formboxid} input[name='pricehistoryType']`).val();
	const listingUrlPropAmc = $(`#${formboxid} input[name='listingUrl']`).val();
	const type = $(`#${formboxid} input[name='type']`).val();
	const sharerId = $(`#${formid} input[name='SharerId']`).val();
	const sharerType = $(`#${formid} input[name='SharerType']`).val();
	let whatsappOptn = !!$(`#${otpboxformid} input[name='whatsapp_check']:checked`).length;
	if ($(`#${formid} #formaction`).val() && $(`#${formid} #formaction`).val().toLowerCase() == 'whatsapp') whatsappOptn = true;

	let propertyTitle = "";
	let user = 0;
	let userType = "";
	const DotcomProjectId = "";
	let userName = "";
	let campIDAzuro = 0;

	if (formtype == "LISTING") {
		propertyTitle = $(`#${formid} input#formPropertyTitle`).val();
		location = $(`#${formid} input#formLocation`).val();
		propertyId = $(`#${formid} input#formPropertyId`).val();
		user = $(`#${formid} input#formUserId`).val();
		userType = $(`#${formid} input#formUserTypeId`).val();
		userName = $(`#${formid} input#formUserName`).val();
		if (localStorage.getItem('_campId')) {
			campIDAzuro =  localStorage.getItem('_campId');
		}
	}

	if (formtype == "PROJECT") {
	  location = $(`#${formid} input#prjcity`).val();
	}

	if (formtype == "AGENT") {
		user = $(`#${formid} input#formUserId`).val();
		userType = $(`#${formid} input#formUserTypeId`).val();
		userName = $(`#${formid} input#formUserName`).val();
	}

	let formname = "";
	if (pageCategory == 'LISTINGRENTALDSE' || pageCategory == 'LISTINGRESALEDSE' || pageCategory == 'DSE' || pageCategory == 'New_Project_Detail' || pageCategory == 'RECOMMENDATIONNEWPROJECTLISTING' || pageCategory == 'RECOMMENDATIONRESALELISTING' || pageCategory == 'RECOMMENDATIONRENTALLISTING' || pageCategory == 'LISTING' || pageCategory == 'LISTINGRENTALDETAIL' || pageCategory == 'LISTINGRESALEDETAIL' || pageCategory == 'PROJECT' || pageCategory == 'AGENT' || pageCategory == 'PROPSAMCCMS' || pageCategory == 'azadi-tour' || pageCategory == 'Upcoming_Projects') {
		formname = $(`#${formid} input#dev_formname`).val();
	}

	const formdata = JSON.stringify(globalfn.serializeToJson($(`#${formid}`).serializeArray()));
	if (typeof window.campidforazuro != 'undefined' && window.campidforazuro != '' && window.campidforazuro == 'lease') {
		campIDAzuro = 50007;
	}
	if (localStorage.getItem('_campId')) {
		campIDAzuro =  localStorage.getItem('_campId');
	}
	const apiurl = "/user/lead/globalverifyotp";

	const projectIds = [];
	var compareMode = '';
	var rsListingIds = '';
	var selectedUnitIds = '';
	if (pageCategory == "COMPARE") {
		if ($('.grid.available').length) {
			$('.grid.available').each(function () {
				projectIds.push($(this).data('id'));
			});
		} else {
			// New compare page V2: read from hidden input
			($('#hd_compareProjectIds').val() || '').split(',').filter(Boolean).forEach(function (id) {
				projectIds.push(id);
			});
			compareMode = $('#hd_compareMode').val() || '';
			rsListingIds = $('#hd_compareRsListingIds').val() || '';
			selectedUnitIds = $('#hd_compareSelectedUnitIds').val() || '';
		}
	}

	let info = $(`#${formid}_info`).val();
	info = JSON.parse(info);
	let videoId = 0;
	if (info.videoId) videoId = info.videoId;

	const _syCtx = (window.syPulse && window.syPulse.context) ? window.syPulse.context() : {};
	$.ajax({
		type: "POST",
		url: apiurl,
		data: { videoId, projectIds: projectIds.toString(), compareMode, rsListingIds, selectedUnitIds, formtype, name, email, propertyTitle, location, mobile, countryCode, otp, propertyId, user, userType, sharerId, sharerType, whatsappOptn, DotcomProjectId, formdata, buildingId: builderid, type, priceHistorPage, listingUrlPropAmc, campIDAzuro, formname, pageCategory, unitSizes, unitPrices, unitCategories, formboxid, sy_anon_id: _syCtx.anon_id || '', sy_session_id: _syCtx.session_id || '', sy_page_group: _syCtx.page_group || '', sy_traffic_source: _syCtx.traffic_source || '', sy_traffic_detail: _syCtx.traffic_detail || '', sy_form_placement: getSyFormPlacement(formid, pageCategory, formboxid), sy_lead_channel: 'call' },
		traditional: true,
		success(response) {
			globalconfirmotpcallback(otp, formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, pageCategory, isdsepage, builderid, iscommonleadform, formtype, listingtype, response, countryCode, unitSizes = [], unitPrices = [], unitCategories = [],loadviewinpopup, 'full_form');
		},
		error(xhr, error) {
			if (xhr.status >= 500) {
				helperJS.alertBox('success', "Thanks for showing interest. Our real estate experts will get back to you shortly.");
				$(`#${formboxid} .globalModal`).removeClass('active');
				$('#dev_headeroverlay').hide();
			} else {
				helperJS.alertBox('error', "Something went wrong,try again");
			}
			// $("#" + otpboxformid + " .otpError").html("Something went wrong,try again");
			$(`#${formid} input[name='iswhatsappclick']`).attr("value", "0");
			$('#loaderBox').hide();
		}
	});

	if (formtype == 'USERPREFERENCE' && typeof _paq != 'undefined') {
		const eventName = { DataSavedInDb: formdata };
		_paq.push(['trackEvent', 'Save_search_sucess', 'click', JSON.stringify(eventName)]);
	}
};

const afterVerificationPropamcResponse = (otpboxformid, formboxid, changeNumberformid, formid) => {
	if (globalfn.globaltimeinterval) {
		clearInterval(globalfn.globaltimeinterval);
	}
	$(`#${otpboxformid}`).removeClass('active');
	$(`#${formboxid}`).removeClass('active');
	$('#loaderBox').hide();
	$(`#${formid}`)[0].reset();
	const city = $(`#${formid} input#dev_inputelement`).attr('placeholder');
	$('#ddlLocation').val(city);
	$(`#${otpboxformid}`)[0].reset();
	$(`#${changeNumberformid}`)[0].reset();
	if (isMobileBrowser()) {
		$('.fullAccessFixBox').hide();
	} else {
		$('.btnSubscribe').hide();
	}
	$(".globalOverlay").removeClass('active');
	$('.gblPpup.subscribeBox,.globalModal.subscribeBox').removeClass('active');
	// $("#" + formid + "_leadForm").addClass("active");
	helperJS.alertBox('success', 'Thank you for showing your interest, One of our representative will get in touch with you shortly.');
};

const getglobalAgentPopupHtml = (beatsresponse, redirecturl, whatsappurl, thankyoumsg) => {
	if (beatsresponse.SalesPersonName != undefined && beatsresponse.SalesPersonContact != undefined && beatsresponse.SalesPersonName != "" && beatsresponse.SalesPersonContact != "") {
		let dev_Modal_agentModalBox = '<div class="agentModalBox active">'
                        + '<div class="agentModalBody">'
                          + '<div class="closeAgentModalPopup"><em class="icon-close"></em></div>'
                            + '<div class="figureBox">'
                                + '<picture>';

		if (beatsresponse.SalesPersonProfilePic != undefined && beatsresponse.SalesPersonProfilePic != "") {
			dev_Modal_agentModalBox = `${dev_Modal_agentModalBox}<img itemprop="image" class="img-responsive" src="${beatsresponse.SalesPersonProfilePic}" alt="${typeof beatsresponse.SalesPersonName != 'undefined' ? beatsresponse.SalesPersonName : 'N/A'}">`;
		} else {
			dev_Modal_agentModalBox = `${dev_Modal_agentModalBox}<span class="clr clr31">${typeof beatsresponse.SalesPersonName != 'undefined' ? beatsresponse.SalesPersonName.charAt(0).toUpperCase() : 'N/A'}</span>`;
		}

		dev_Modal_agentModalBox = `${dev_Modal_agentModalBox}</picture>`
        + `</div>`;

		dev_Modal_agentModalBox = `${dev_Modal_agentModalBox}<strong class="name">${typeof beatsresponse.SalesPersonName != 'undefined' ? beatsresponse.SalesPersonName : 'N/A'}</strong>`
		+ `<span class="phone">${beatsresponse.SalesPersonCountryCode}-${beatsresponse.SalesPersonContact}</span>`
		+ `<ul class="leadBtnBox">`
		+ `<li><a class="in-call" href="tel:${beatsresponse.SalesPersonCountryCode}${beatsresponse.SalesPersonContact}"><em class="icon-phone-o"></em>Call Now</a></li>`
		+ `<li><a class="in-whatsapp" href="${whatsappurl}"><em class="icon-whatsapp"></em>WhatsApp</a></li>`
		+ `</ul>`;

		if (redirecturl) {
			dev_Modal_agentModalBox = `${dev_Modal_agentModalBox}<div class="btnBox">`
			+ `<a href="${redirecturl}" class="btn btn-primary">Take to My Personal Profile <em class="icon-angle-right"></em></a>`
			+ `</div>`;
		}

		dev_Modal_agentModalBox = `${dev_Modal_agentModalBox}</div>`
		+ `</div>`;

		return dev_Modal_agentModalBox;
	} else {
		let dev_Modal_agentModalBox = `${'<div class="agentModalBox active">'
			+ '<div class="agentModalBody"><div class="closeAgentModalPopup">'
            + '<em class="icon-close"></em></div><div class=""></div>'
            + '<span class="phone" style="white-space: normal !important;">'}${thankyoumsg}</span>`;
		if (redirecturl) {
			dev_Modal_agentModalBox = `${dev_Modal_agentModalBox}<div class="btnBox">`
			+ `<a href="${redirecturl}" class="btn btn-primary">`
			+ `Take to My Personal Profile <em class="icon-angle-right"></em></a>`
			+ `</div>`;
		}

		dev_Modal_agentModalBox = `${dev_Modal_agentModalBox}</div>`
		+ `</div>`;

		return dev_Modal_agentModalBox;
	}
};

const getglobalAgentPopupHtmlForDSE = (beatsresponse, redirecturl, whatsappurl, thankyoumsg) => {
	if (beatsresponse.SalesPersonName != undefined && beatsresponse.SalesPersonContact != undefined && beatsresponse.SalesPersonName != "" && beatsresponse.SalesPersonContact != "") {
		let dev_Modal_agentModalBox = '<div class="ldBx"><div class="ldBxClsBtn"><em class="icon-close"></em></div>'
		+ '<div class="ldBdy"><div class="ldBxfigureBox">';

		if (beatsresponse.SalesPersonProfilePic != undefined && beatsresponse.SalesPersonProfilePic != "") {
			dev_Modal_agentModalBox = `${dev_Modal_agentModalBox}<img itemprop="image" class="img-responsive" src="${beatsresponse.SalesPersonProfilePic}" alt="${typeof beatsresponse.SalesPersonName != 'undefined' ? beatsresponse.SalesPersonName : 'N/A'}">`;
		} else {
			dev_Modal_agentModalBox = `${dev_Modal_agentModalBox}<span class="clr clr31">${typeof beatsresponse.SalesPersonName != 'undefined' ? beatsresponse.SalesPersonName.charAt(0).toUpperCase() : 'N/A'}</span>`;
		}
		dev_Modal_agentModalBox = `${dev_Modal_agentModalBox}</div>`
		+ `<strong class="ldBxAgntName">${typeof beatsresponse.SalesPersonName != 'undefined' ? beatsresponse.SalesPersonName : 'N/A'}</strong>`
		+ `<span class="ldBxAgntPhone">${beatsresponse.SalesPersonCountryCode}-${beatsresponse.SalesPersonContact}</span>`
		+ `<ul class="ldBxAgntLdBxBtnBox">`
			+ `<li><a class="in-call" href="tel:${beatsresponse.SalesPersonCountryCode}${beatsresponse.SalesPersonContact}"><em class="icon-phone-o"></em>Call Now</a></li>`
			+ `<li><a class="in-whatsapp" href="${whatsappurl}"><em class="icon-whatsapp"></em>WhatsApp</a></li>`
		+ `</ul>`
		+ `</div>`;

		if (redirecturl) {
			dev_Modal_agentModalBox = `${dev_Modal_agentModalBox
			}<a href="${redirecturl}" class="btn btn-primary ldBtnPrmry">Take to My Personal Profile <em class="icon-angle-right"></em></a>`;
		}

		dev_Modal_agentModalBox += "</div><div class='gblOrflw'></div>";

		return dev_Modal_agentModalBox;
	} else {
		let dev_Modal_agentModalBox = '<div class="ldBx"><div class="ldBxClsBtn"><em class="icon-close"></em></div>'
		+ '<div class="ldBdy">';
		dev_Modal_agentModalBox = `${dev_Modal_agentModalBox}<p>${thankyoumsg}</p></div>`;

		if (redirecturl) {
			dev_Modal_agentModalBox = `${dev_Modal_agentModalBox
			}<a href="${redirecturl}" class="btn btn-primary ldBtnPrmry">Take to My Personal Profile <em class="icon-angle-right"></em></a>`;
		}

		dev_Modal_agentModalBox += "</div><div class='gblOrflw'></div>";

		return dev_Modal_agentModalBox;
	}
};

const getMoreInfoByPageCategory = (pageCategory, formid) => {
	const details = { name: '', location: '', price: '', rating: '', tag: '', listingType: '', marketingPlan: {} };
	if (pageCategory && pageCategory.toLowerCase().indexOf('listing') != -1 && $(`#${formid} input#formListingType`).length && $(`#${formid} input#formListingType`).val() != '') {
		details.listingType = $(`#${formid} input#formListingType`).val();
	}
	if ($(`#${formid}_info`).length <= 0) {
		return details;
	}

	let info = $(`#${formid}_info`).val();
	info = JSON.parse(info);
  

	if (info.name == "") {
		return details;
	}

	if (typeof info != 'undefined' && typeof info.marketingPlan != 'undefined' && Object.keys(info.marketingPlan).length > 0) {
		 details.marketingPlan = info.marketingPlan;
	}


	details.name = info.name;
	// error of indexOf
	if (typeof info != 'undefined' && info.location != "" && typeof info.location != 'undefined' && info.location.indexOf("undefined") == -1) {
		details.location = info.location;
	}

	if (info.price != "") {
		if (pageCategory == 'PROJECT' || pageCategory == 'DSE' || pageCategory == 'RECOMMENDATIONNEWPROJECTLISTING') {
			if (typeof info.isDIPriceAvailable != 'undefined' && info.isDIPriceAvailable == 1) {
				if (info.perSqFt && info.perSqFt != '0') {
					details.price = globalfn.numberWithCommas(info.perSqFt);
				}
			} else if (info.lowCostText == '0') {
				details.price = "Price on Request";
			} else if (info.lowCostText == info.highCostText) {
				details.price = `₹ ${info.lowCostText}`;
			} else {
				details.price = `₹ ${info.lowCostText} to ${info.highCostText}`;
			}
		}
	}

	if (pageCategory == 'LISTING' || pageCategory == 'RECOMMENDATIONRESALELISTING' || pageCategory == 'RECOMMENDATIONRENTALLISTING') {
		details.rating = info.rating;

		if (info.userType == 'CP' && info.agentPremium) {
			details.tag = "Preferred Partner";
		} else if (info.userType.toLowerCase() == 'employee') {
			details.tag = "SY Expert";
		} else if (info.userType == 'Owner') {
			details.tag = "Owner";
		}

		if (info.totalPrice == 0) {
			details.price = "Price on Request";
		} else if (typeof info.totalPrice != 'undefined' && info.totalPrice != "" && typeof info.priceDurationName != 'undefined' && info.priceDurationName != "") {
			details.price = `${info.totalPrice} ${info.priceDurationName}`;
		}
		if (!(info.type == 'resale') && info.depositAmount != "" && info.depositAmount != undefined && info.depositAmount != 'Zero Deposit') {
			details.price = `${details.price}Deposit Amount: ${info.depositAmount}`;
		}
		if (details.listingType == '' && info.type) {
			details.listingType = info.type;
		}
	}

	return details;
};

// const getSimilarProperties = (newdata) => {
// 	if (typeof newdata != 'undefined' && newdata.data) {
// 		const similarListingsData = newdata.data;
// 		let dev_Modal_SimilarListingBox = '<div class="suggestedTileBox"><div class="suggestedHeading">Suggested properties for you</div><div class="owl-carousel suggestedSlider scrollBarHide">';
// 		for (let i = 0; i < similarListingsData.length; i++) {
// 			dev_Modal_SimilarListingBox += (`<div class="item" data-propertyid="${similarListingsData[i].propertyId}"data-projectname="${similarListingsData[i].projectName}"data-propertytype="${similarListingsData[i].propertyType}"data-propertytitle="${similarListingsData[i].propertyTitle}"data-minprice="${similarListingsData[i].totalPrice}"data-maxprice="${similarListingsData[i].totalPrice}"data-minarea="${similarListingsData[i].availArea}"data-maxarea="${similarListingsData[i].availArea}"data-sublocalityname="${similarListingsData[i].subLocalityName}"data-sublocalityid="${similarListingsData[i].subLocalityId}"data-unittype="${similarListingsData[i].unitType}"data-cityname="${similarListingsData[i].cityName}"data-cityid="${similarListingsData[i].cityId}">
// 			    <div class="pUnitTile">
//                     <div class="figureBox">
// 						<figure class="figure imageSkeleton">
// 							<img class="img-responsive" src="${((similarListingsData[i].imageName) ? similarListingsData[i].imageName : '_CDN_IMAGES_URL' + 'ui-assets/images/default-images/apartment.svg')}" alt="${similarListingsData[i].marketingTitle}" alt="project name" width="115" height="115" >
// 						</figure>
// 						<div class="figureBody">
// 						    <a href="${baseUrl + similarListingsData[i].url}" >
// 							   ${(similarListingsData[i].projectName != '' && similarListingsData[i].projectName) ? `<strong class="pName">${similarListingsData[i].projectName}</strong>` : ''}
// 								<span class="pLocation">${(similarListingsData[i].buildingType == 'Residential') ? (
// 									`${similarListingsData[i].unitType ? similarListingsData[i].unitType : ''} ${similarListingsData[i].propertyType ? similarListingsData[i].propertyType.replace("Apartments", "Flat").replace("Apartment", "Flat") : ''} For ${similarListingsData[i].listingType} in ${similarListingsData[i].subLocalityName}`)
// 								: (
// 						similarListingsData[i].propertyType ? similarListingsData[i].propertyType.replace("Apartments", "Flat").replace("Apartment", "Flat") : `${'' + ' For '}${similarListingsData[i].listingType} in ${similarListingsData[i].subLocalityName}`)
// 				}</span>
// 							</a>
// 							<ul class="pSizeList">
// 								<li><span>₹ ${parseInt(similarListingsData[i].totalPrice) ? helperJS.convertAmountToWord(similarListingsData[i].totalPrice) : 'Price on Request'}</span></li>
// 								<li>${`${similarListingsData[i].availArea} ${similarListingsData[i].areaUOMName}`}</li>
// 							</ul>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		`);
// 		}
// 		return dev_Modal_SimilarListingBox += '</div></div>';
// 	} else {
// 		return '';
// 	}
// };



const getSimilarProperties = (newdata) => {
    if (typeof newdata !== 'undefined' && newdata.data && Array.isArray(newdata.data) && newdata.data.length > 0 && !isMobileBrowser()) {
        const similarListingsData = newdata.data;

        let html = `
        <div class="matching-property sm-arrow">
            <div class="title-heading">Matching Properties for You</div>
            <div class="bxslider property-card-box scrollbar-hide" id="tile-slider">`;

        similarListingsData.forEach(item => {
            const imageUrl = item.imageName ? item.imageName : (_CDN_IMAGES_URL + 'ui-assets/images/default-images/apartment.svg');
			const priceText = parseInt(item.totalPrice) ? '₹ ' + helperJS.convertAmountToWord(item.totalPrice) : 'Price on Request';
            const href = `${baseUrl}${item.url || ''}`;

            html += `
            <div class="property-card"
                data-propertyid="${item.propertyId}"
                data-projectname="${item.projectName || ''}"
                data-propertytype="${item.propertyType || ''}"
                data-propertytitle="${item.propertyTitle || ''}"
                data-minprice="${item.totalPrice || ''}"
                data-maxprice="${item.totalPrice || ''}"
                data-minarea="${item.availArea || ''}"
                data-maxarea="${item.availArea || ''}"
                data-sublocalityname="${item.subLocalityName || ''}"
                data-sublocalityid="${item.subLocalityId || ''}"
                data-unittype="${item.unitType || ''}"
                data-cityname="${item.cityName || ''}"
                data-cityid="${item.cityId || ''}"
            >
                <figure>
                    <img class="img-responsive" 
                        src="${imageUrl}"
                        alt="${item.marketingTitle || ''}"
                    >
                </figure>

				<div class="figure-body" onclick="onSimilarProjectClick('${href}', '${item.projectName || ''}', 'Similar_Properties_Click')">
					<strong>${item.projectName || ''}</strong>
                        <span class="location">${item.subLocalityName || ''}, ${item.cityName || ''}</span>
                    <span class="property-price">
                         ${priceText}
                    </span>
                </div>
            </div>`;
        });

        html += `</div></div>`; // close slider + wrapper
        return html;
    } else {
        return '';
    }
};



const generateTable = (units) => {
	if (!units || !units.length) return '';

	let allUnits = [];
	for (let i = 0; i < units.length; i++) {
		if (units[i].unit) {
			allUnits = allUnits.concat(units[i].unit);
		}
	}

	const tableRows = allUnits
		.map((unit, index) => `
            <tr ${index >= 2 ? 'class="hiddenRow"' : ''}> <!-- Hide rows beyond first 2 -->
                <td><span>${unit.unitName}</span></td>
                <td><span>(${unit.displayAreaName})</span></td>
                <td><span class="price">${unit.priceText == 0 ? 'Price on Request' : `₹ ${unit.priceText}`}</span></td>
            </tr>
        `).join('');

	const totalRows = allUnits.length;

	const moreUnitsBtn = totalRows > 2
		? `<div class="btn moreUnit">+${totalRows - 2} More <em class="icon-arrow-down"></em></div>`
		: '';

	return `
        <div class="pTable scrollBar">
            <table width="100%" border="1" cellspacing="0" cellpadding="5">
                <tbody>${tableRows}</tbody>
            </table>
            ${moreUnitsBtn} 
        </div>
    `;
};

// const getSimilarPropertiesForProjects = (newdata) => {
// 	if (!newdata || !newdata.length) return '';

// 	let dev_Modal_SimilarListingBox = `
//         <div class="suggestedTileBox">
//             <div class="suggestedHeading">Suggested properties for you</div>
//             <div class="owl-carousel project suggestedSlider scrollBarHide">
//     `;

// 	newdata.forEach((property) => {
// 		const source = property._source;
// 		const imageUrl = source.flagshipImage ? `https://static.squareyards.com/${source.flagshipImage}` : '_CDN_IMAGES_URL' + 'ui-assets/images/default-images/apartment.svg';
// 		const projectUrl = baseUrl + source.projectUrl;
// 		const projectName = source.projectName;
// 		const subLocation = source.subLocation || '';
// 		const city = source.city || '';
// 		const units = source.units || [];

// 		dev_Modal_SimilarListingBox += `
//             <div class="item">
//                 <div class="pUnitTile">
//                     <div class="figureBox">
//                         <figure class="figure imageSkeleton">
//                             <img class="img-responsive" src="${imageUrl}" alt="${projectName}">
//                         </figure>
//                         <div class="figureBody">
//                             <a href="${projectUrl}">
//                                 <strong class="pName">${projectName}</strong>
//                                 <span class="pLocation">${subLocation}, ${city}</span>
//                             </a>
//                         </div>
//                     </div>
//                     ${generateTable(units)} 
//                 </div>
//             </div>
//         `;
// 	});

// 	return `${dev_Modal_SimilarListingBox}</div></div>`;
// };

function onSimilarProjectClick(projectUrl, projectName, eventName) {
    if (typeof _paq !== 'undefined') {
        _paq.push(['trackEvent','product', eventName || 'Similar_Project_Click', JSON.stringify({projectName: projectName,projectUrl: projectUrl})
        ]);
    }
    window.location.href = projectUrl;
}


const getSimilarPropertiesForProjects = (newdata) => {
    if (!newdata || !newdata.length) return '';

	if(!isMobileBrowser()){
		let html = `
			<div class="matching-property sm-arrow">
				<div class="title-heading">Matching Projects for You</div>
				<div class="bxslider property-card-box scrollbar-hide" id="tile-slider">
		`;

		newdata.forEach((property) => {
			const source = property._source;
			const imageUrl = source.flagshipImage ? _CDN_IMAGES_URL + source.flagshipImage : _CDN_IMAGES_URL + 'ui-assets/images/default-images/apartment.svg';
			const projectName = source.projectName || '';
			const location = `${source.subLocation || ''}, ${source.city || ''}`;
			const projectUrl = baseUrl + source.projectUrl;
			const priceRange =
				source.minPrice && source.maxPrice
					? `₹ ${helperJS.convertAmountToWord(source.minPrice)} to ${helperJS.convertAmountToWord(source.maxPrice)}`
					: 'Price on Request';

			html += `
				<div class="property-card">
					<figure>
						<img class="img-responsive" src="${imageUrl}" alt="${projectName}">
					</figure>
					<div class="figure-body" onclick="onSimilarProjectClick('${projectUrl}', '${projectName.replace(/'/g, "\\'")}', 'Similar_Project_Click')">
						<strong>${projectName}</strong>
						<span class="location">${location}</span>
						<span class="property-price">${priceRange}</span>
					</div>
				</div>
			`;
		});

		html += `</div></div>`; 

		return html;
	}else{
		return ''
	}
};


/* const getSimilarProjects = () => {
	if (($('#listingSimilarProjects').length && $('#listingSimilarProjects').val() && JSON.parse($('#listingSimilarProjects').val()).length)) {
		let similarListingsData = '';
		similarListingsData = (JSON.parse($('#listingSimilarProjects').val()));
		let dev_Modal_SimilarListingBox = '<div class="suggestedTileBox"><div class="suggestedHeading">Suggested properties for you</div><div class="owl-carousel suggestedSlider scrollBarHide">';
		for (let i = 0; i < similarListingsData.length; i++) {
			dev_Modal_SimilarListingBox += (`<div class="item" onclick="location.href = '${helperJS.createProjectUrlFromDSe((similarListingsData[i].CityName.toLowerCase() ? similarListingsData[i].CityName.toLowerCase() : similarListingsData[i].City.toLowerCase()), similarListingsData[i].ProjectId, similarListingsData[i].ProjectName)}'">
			<div class="suggestTileBox">
			  <div class="suggestTileFigureBox">
			  <figure class="suggestTileFigure"><img class="img-responsive" src="${((similarListingsData[i].ImagePath) ? similarListingsData[i].ImagePath : '_CDN_IMAGES_URL' + 'ui-assets/images/default-images/apartment.svg')}" alt="${similarListingsData[i].ProjectName}" width="115" height="115"></figure>
				</div>
				<div class="suggestTileBody"> <a href="${helperJS.createProjectUrlFromDSe(similarListingsData[i].CityName.toLowerCase(), similarListingsData[i].ProjectId, similarListingsData[i].ProjectName)}" >
				${(similarListingsData[i].ProjectName != '' && similarListingsData[i].ProjectName) ? `<div class="suggestTileProjectName">${similarListingsData[i].ProjectName} </div>` : ''}
				<div class="suggestTileTitle">
				${(similarListingsData[i].PrimarySubLocation && similarListingsData[i].CityName) ? `${similarListingsData[i].PrimarySubLocation}, ${similarListingsData[i].CityName}` : (similarListingsData[i].PrimarySubLocation) ? similarListingsData[i].PrimarySubLocation : similarListingsData[i].CityName} 
				</div>
				</a>
				<div class="suggestTilePriceSqft">
					<div class="flex suggestTilePriceBox">
						${(typeof similarListingsData[i].isDIPriceAvailable != 'undefined' && similarListingsData[i].isDIPriceAvailable == 1) ? (typeof similarListingsData[i].perSqFt != 'undefined' && similarListingsData[i].perSqFt != '0' ? globalfn.numberWithCommas(similarListingsData[i].perSqFt) : '') : (similarListingsData[i].LowCostText != 0) ? `${similarListingsData[i].currency + similarListingsData[i].LowCostText} to ${similarListingsData[i].HighCostText}` : 'Price on Request'}
					</div>
				</div>
				</div>
			</div>
		</div>`);
		}
		return dev_Modal_SimilarListingBox += '</div></div>';
	} else if (typeof newdata != 'undefined' && newdata.length) {
		let similarListingsData = '';
		similarListingsData = newdata;
		let dev_Modal_SimilarListingBox = '<div class="suggestedTileBox"><div class="suggestedHeading">Suggested properties for you</div><div class="owl-carousel suggestedSlider scrollBarHide">';
		for (let i = 0; i < similarListingsData.length; i++) {
			dev_Modal_SimilarListingBox += (`<div class="item" onclick="location.href = '${helperJS.createProjectUrlFromDSe((similarListingsData[i]._source.city.toLowerCase() ? similarListingsData[i]._source.city.toLowerCase() : similarListingsData[i]._source.city.toLowerCase()), similarListingsData[i]._id, similarListingsData[i]._source.projectName)}'">
			<div class="suggestTileBox">
			  <div class="suggestTileFigureBox">
			  <figure class="suggestTileFigure"><img class="img-responsive" src="https://static.squareyards.com/${((similarListingsData[i]._source.flagshipImage) ? similarListingsData[i]._source.flagshipImage : '_CDN_IMAGES_URL' + 'ui-assets/images/default-images/apartment.svg')}" alt="${similarListingsData[i]._source.projectName}" width="115" height="115"></figure>
				</div>
				<div class="suggestTileBody"> <a href="${helperJS.createProjectUrlFromDSe(similarListingsData[i]._source.city.toLowerCase(), similarListingsData[i]._id, similarListingsData[i]._source.projectName)}" >
				${(similarListingsData[i]._source.projectName != '' && similarListingsData[i]._source.projectName) ? `<div class="suggestTileProjectName">${similarListingsData[i]._source.projectName} </div>` : ''}
				<div class="suggestTileTitle">
				${(similarListingsData[i]._source.subLocation && similarListingsData[i]._source.city) ? `${similarListingsData[i]._source.subLocation}, ${similarListingsData[i]._source.city}` : (similarListingsData[i]._source.subLocation) ? similarListingsData[i]._source.subLocation : similarListingsData[i]._source.city} 
				</div>
				</a>
				<div class="suggestTilePriceSqft">
					<div class="flex suggestTilePriceBox">${(similarListingsData[i]._source.priceText != 0) ? similarListingsData[i]._source.currency + similarListingsData[i]._source.priceText : 'Price on Request'}</div>
				</div>
				</div>
			</div>
		</div>`);
		}
		return dev_Modal_SimilarListingBox += '</div></div>';
	} else {
		return '';
	}
}; */

const getglobalAgentPopupHtmlForCommonLeadForm = (beatsresponse, redirecturl, whatsappurl, thankyoumsg = 'Your Enquiry Has Been Received', formtype, formid, modalpopupid, pageCategory, countryCode, mobile,newdata, iswhatsappclick = "", whatsapptext = "",loadviewinpopup) => {
    if(formtype == 'PROJECT' && pageCategory == 'stand-alone-lead'){
	$('.standline-leadform').addClass('active');
	}
	$('.lead-form-left-box').remove();
	$('.lead-banner-content').remove();
	$(".syFormBox .whyInvestThroughSquareYards").hide();
	$(".syWhyInvest").hide();
	$(".syFormBox .info-badge").hide();
	$(".syFormBox").addClass("thank-you-success");
	// if(formtype == 'AGENT' && iswhatsappclick == "1"){
	// 	$('.global-modal-body').addClass("banner-less-form");
	// }
	if(typeof newdata == 'undefined' && formtype == 'LISTING' && isMobileBrowser()){
	 $(".syFormBox.thank-you-success").addClass("thank-you-msg mobile");
	}
	if(newdata && newdata.length == 0 && formtype == 'PROJECT' && isMobileBrowser()){
	 $(".syFormBox.thank-you-success").addClass("thank-you-msg mobile");
	}
	if(isMobileBrowser() || loadviewinpopup == false){
	  $(".syFormBox.thank-you-success").addClass("mobile");
	}
	if (localStorage.getItem('_campId')) {
		localStorage.removeItem("_campId");
    }
    const details = getMoreInfoByPageCategory(pageCategory, formid);
    const $form = $(`#${formid}`);
    const userType = $form.find("input[name='userType']").val();
    const ownerName = $form.find("input[name='userName']").val();
    const propertyId = $form.find("input[name='propertyId']").val();
    const listingAgentPic = $form.find("input[name='profilePic']").val();
    const formname = $form.find("input[name='dev_formname']").val() || "";
	const DtComProjectID = $form.find("input[name='DtComProjectID']").val() || "";
    let dev_Modal_agentModalBox = "";
	const appLink =
		typeof ltype !== "undefined"
			? ltype === "Sale"
				? "https://sy.sqweb.in/bohjdxng"
				: ltype === "Rent"
					? "https://sy.sqweb.in/rgmcmcbc"
					: ""
			: "https://sy.sqweb.in/dzybzore";


	if(formtype==="PROJECT"){
		let enquiredProjects = helperJS.getLocalItem('enquiredProjects') || []
		// includes
		if(!enquiredProjects.includes(DtComProjectID)){
			enquiredProjects.push(Number(DtComProjectID));
			helperJS.setLocalItem('enquiredProjects', enquiredProjects);
		}

	}else if(formtype==="LISTING"){
		let enquiredListings = helperJS.getLocalItem('enquiredListings') || []
		if(!enquiredListings.includes(propertyId)){
			enquiredListings.push(Number(propertyId));
			helperJS.setLocalItem('enquiredListings', enquiredListings);
		}
	}

	if (typeof page == 'undefined' || page != 'homePage') initAppLinkSender();

    // AGENT ASSIGNED
    if ( pageCategory !== 'propamcCommonServices' && beatsresponse.SalesPersonName && beatsresponse.SalesPersonContact) {
        $(`#${modalpopupid}`).addClass("agentAssigned").removeClass("agentNotAssigned");
        $(".syFormBox .whyInvestBox").hide();

        const agentName = beatsresponse.SalesPersonName;
        const agentImg = beatsresponse.SalesPersonProfilePic
            ? `<img class="img-responsive" src="${beatsresponse.SalesPersonProfilePic}" alt="${agentName}">`
            : `<span class="clr clr${getColorNum(propertyId)}">${agentName[0].toUpperCase()}</span>`;

        dev_Modal_agentModalBox = `
             <div class="thank-you-modal">
					<div class="dialog-modal">
                        <div class="left-body">
                            <div class="thank-you-content">
								<div class="thankyou-text">
									<span class="check"><img class="img-responsive" src="/assets/images/submit-popup/thankyou-check.gif" alt=""></span>
									<h3>Thank you!</h3>
									<p>Your Enquiry Has Been Received</p>
								</div>
                                ${!formname.includes("ViewNumber") ? `<span class="our-agent-name">Listing agent <strong>${agentName}</strong> will contact you shortly</span>` : ''}
        `;

        if ((formtype === "LISTING" || formtype === "AGENT") && iswhatsappclick !== "1" && formid !== 'listingDetailContactAgentFormAgent') {
			const tag = ((userType || '').toLowerCase() == 'employee') ? "SY Expert" : (userType == 'Owner' ? "Owner" : "Agent");
            dev_Modal_agentModalBox += `
                                <div class="agent-box">
                                    <figure>${agentImg}</figure>
                                    <span><strong>${agentName}</strong> ${tag}${formname.includes("ViewNumber") ? ` - ${beatsresponse.SalesPersonContact}` : ''}</span>
                                    ${formname.includes("ViewNumber") ? `
                                    <div class="btn-box">
										<a href="tel:${beatsresponse.SalesPersonCountryCode}${beatsresponse.SalesPersonContact}" class="btn btn-primary">
											<em class="icon-expert-call"></em>
										</a>
									</div>` : ''}
                                </div>
            `;
        }
        dev_Modal_agentModalBox += `</div>`;


		// PROJECT BANNER
        if (formtype === "PROJECT" && iswhatsappclick !== "1") {
            dev_Modal_agentModalBox += `<div class="projectBanner"></div>`;
        }
		
		if(!isMobileBrowser() && loadviewinpopup == true && pageCategory != 'Stalled_Project'){
			// SHOW SIMILAR PROPERTIES FOR LISTING
			if (formtype === "LISTING" && iswhatsappclick !== "1" && formid !== 'listingDetailContactAgentFormAgent' && formid !== 'ClientInfoForm_common_gallery') {
				const similar = newdata && newdata.data ? getSimilarProperties(newdata) : "";
				dev_Modal_agentModalBox += similar;
            }
			dev_Modal_agentModalBox += `</div>`;
			dev_Modal_agentModalBox += `<div class="right-body">
			<div class="lead-banner-content lead-banner">
				<div class="thankyou-banner">
					<div class="thankyou-banner-header">
					<figure> <img class="img-responsive" loading="lazy" src="/assets/images/thankyou-app.png" alt="" width="" height=""> </figure>
					<div class="text">
						<label>Your home decisions,</label>
						<strong> now <span>smarter</span><br>
						than ever </strong> </div>
					</div>
					<ul class="thankyou-features-list">
					<li class="blue"> <em class="icon-chart-o"></em> <span><strong>Data-Driven Insights</strong>Make informed decisions</span> </li>
					<li class="green"> <em class="icon-bell"></em> <span><strong>Instant Alerts</strong>Stay ahead, always</span> </li>
					<li class="yellow"> <em class="icon-idea-o"></em> <span><strong>Smart Suggestions</strong>Discover more, effortlessly</span> </li>
					<li class="purple"> <em class="icon-rupee"></em> <span><strong>Refer & Earn</strong>Upto ₹25k rewards</span> </li>
					</ul>
					<div class="stores qr-code">
					<figure> <img class="img-responsive" loading="lazy" src="/assets/images/lead-qr.svg" alt="" width="" height=""> </figure>
					<span><strong>Scan to Download App</strong>Available on <em class="icon-ios"></em> iOS & <em class="icon-android"></em> Android</span> </div>
				</div>
				</div>
				</div>`;
		}

		if(isMobileBrowser() || loadviewinpopup == false){
			dev_Modal_agentModalBox += `
					<div class="lead-banner-content lead-banner">
					<div class="thankyou-banner">
						<div class="thankyou-banner-header">
						<figure> <img class="img-responsive" loading="lazy" src="/assets/images/thankyou-app.png" alt="" width="" height=""> </figure>
						<div class="text">
							<label>Your home decisions,</label>
							<strong> now <span>smarter</span><br>
							than ever </strong> </div>
						</div>
						<ul class="thankyou-features-list">
						<li class="blue"> <em class="icon-chart-o"></em> <span><strong>Data-Driven Insights</strong>Make informed decisions</span> </li>
						<li class="green"> <em class="icon-bell"></em> <span><strong>Instant Alerts</strong>Stay ahead, always</span> </li>
						<li class="yellow"> <em class="icon-idea-o"></em> <span><strong>Smart Suggestions</strong>Discover more, effortlessly</span> </li>
						<li class="purple"> <em class="icon-rupee"></em> <span><strong>Refer & Earn</strong>Upto ₹25k rewards</span> </li>
						</ul>
						${isMobileBrowser() ? `
							<div class="download">Click to Download app</div>
							<div class="stores">
								<a href="${appLink}" class="store">
									<img class="img-responsive" loading="lazy"
										src="/assets/images/banner-gpay-store.png"
										alt="">
								</a>
								<a href="${appLink}" class="store">
									<img class="img-responsive" loading="lazy"
										src="/assets/images/banner-app-store.png"
										alt="">
								</a>
							</div>
						` : `
							<div class="stores qr-code">
								<figure>
									<img class="img-responsive" loading="lazy"
										src="/assets/images/lead-qr.svg"
										alt="">
								</figure>
								<span>
									<strong>Scan to Download App</strong>
									Available on <em class="icon-ios"></em> iOS &
									<em class="icon-android"></em> Android
								</span>
							</div>
						`}
					</div>
					</div>
				`;

				// SHOW SIMILAR PROPERTIES FOR LISTING (outside the template literal)
				if (formtype === "LISTING" && iswhatsappclick !== "1" && formid !== 'listingDetailContactAgentFormAgent' && formid !== 'ClientInfoForm_common_gallery') {
					const similar = newdata && newdata.data ? getSimilarProperties(newdata) : "";
					dev_Modal_agentModalBox += similar;
				}
				dev_Modal_agentModalBox += `</div></div>`; // Close remaining divs
		}


        if (iswhatsappclick === "1" && whatsapptext) {
            dev_Modal_agentModalBox = `<style>
				.globalOverflow{position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.7);z-index:10;display:none}
				.globalOverflow.active{display:block}
				.redirectionPopup{padding:15px;position:fixed;right:0;bottom:5000px;border-radius:15px 15px 0 0;background:#fff;left:0;z-index:15;align-items:center;justify-content:center;transition:.3s}
				.redirectionPopup.active{bottom:0;transition:.3s}
				.popupHeadingBox{padding:30px 21px 24px;min-height:48px;text-align:center;color:#333;display:block;font-size:16px;font-weight:600}
				.popupHeadingBox .agentVerifiedBox{margin-bottom:15px;width:100%;display:inline-block;float:left;text-align:center}
				.popupHeadingBox .agentVerifiedCheck{width:64px;height:64px;border-radius:50%;display:inline-block;stroke-width:4;stroke:#0E9F6E;stroke-miterlimit:10}
				.popupHeadingBox .agentVerifiedCircle{stroke-dasharray:166;stroke-dashoffset:166;stroke-width:5;stroke-miterlimit:10;stroke:#0E9F6E;fill:none;animation:stroke .6s cubic-bezier(0.65,0,0.45,1) forwards}
				.popupHeadingBox .agentVerifiedChecked{transform-origin:50% 50%;stroke-dasharray:48;stroke-dashoffset:48;animation:stroke .3s cubic-bezier(0.65,0,0.45,1) .8s forwards;stroke-linecap:round;stroke-linejoin:round}
				.popupHeadingBox strong{color:#333;font-size:16px;text-align:center;line-height:24px}
				.redirectionPopup .closeBtn{width:14px;height:14px;position:absolute;right:13px;top:13px;cursor:pointer}
				.redirectionPopup .closeBtn em.close{position:relative;display:flex;width:100%;height:100%}
				.redirectionPopup .closeBtn em::before{transform:rotate(-45deg)}
				.redirectionPopup .closeBtn em::after{transform:rotate(45deg)}
				.redirectionPopup .closeBtn em::after,.redirectionPopup .closeBtn em::before{height:13px;width:1px;position:absolute;background:#909090;content:''}
				.whatsappPopupBody .cardBox .tagBox .ico-crown{background-position:-25px -4px;background:url(/assets/images/sprite-icon/agent-tile.svg) no-repeat;background-size:150px;overflow:hidden;display:block}
				.whatsappPopupBody .cardBox{margin-bottom:18px;padding:15px;border:1px solid #e6e6e6;border-radius:8px;background:#fff;display:flex;align-items:center}
				.whatsappPopupBody .cardBox .tagBox{background:#fbc200;width:18px;height:18px;display:flex;align-items:center;justify-content:center;border:solid 1px #fff;border-radius:100%;position:absolute;right:0;top:0}
				.whatsappPopupBody .cardBox .tagBox em{display:block;width:16px;height:10px}
				.whatsappPopupBody .cardBox .tagBox .ico-crown{background-position:-25px -4px}
				.whatsappPopupBody .agentPic{margin-right:14px;width:66px;height:66px;border-radius:100%;position:relative}
				.whatsappPopupBody .agentPic img{background:#fbc200;padding:3px;border-radius:100%;object-fit:cover;width:100%;height:100%}
				.whatsappPopupBody .agentPic small.clr{border-radius:100%;font-size:25px}
				.whatsappPopupBody .cardContent p{margin-bottom:4px;color:#666;font-size:14px;line-height:normal;text-align:left}
				.whatsappPopupBody .cardContent strong{margin-bottom:5px;color:#333;font-size:16px;font-weight:700;text-align:left}
				.whatsappPopupBody .cardContent span{font-size:12px;color:#333}
				.whatsappPopupBody p{margin-bottom:6px;font-size:16px;color:#333;text-align:center}
				.whatsappPopupBody strong{margin-bottom:10px;color:#1f1f1f;font-size:34px;font-weight:700;line-height:normal;text-align:center;display:block}
				.whatsappPopupBody .chat-btn em{font-size:18px;}
				@keyframes stroke {
				100%{stroke-dashoffset:0}
				}
				@keyframes verifiedcheck {
				0%{width:100%}
				100%{width:20px}
				}
			</style>
                <div class="thank-you-modal"><div class="dialog-modal"><div class="left-body">
                <div class="popupHeadingBox" id="agentWhatsAppRedirectPopup">
                    <div class="agentVerifiedBox">
                        <svg class="agentVerifiedCheck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle class="agentVerifiedCircle" cx="26" cy="26" r="25" fill="none"></circle>
                            <path class="agentVerifiedChecked" fill="none" d="M14 27l7 7 17-17"></path>
                        </svg>
                    </div>
                    <strong>${beatsresponse.SalesPersonName} will call you soon</strong><br>or<br>Chat instantly on WhatsApp.
                </div>
                <div class="whatsappPopupBody">
                    <div class="cardBox">
                        <figure class="agentPic">
                            ${
                                beatsresponse.SalesPersonProfilePic
                                    ? `<img src="${beatsresponse.SalesPersonProfilePic}" />`
                                    : `<small class="clr clr${getColorNum(beatsresponse.SalesPersonContact)}">${beatsresponse.SalesPersonName[0].toUpperCase()}</small>`
                            }
                        </figure>
                        <div class="cardContent">
                            <strong>${beatsresponse.SalesPersonName}</strong>
                            <p>${beatsresponse.SalesPersonCountryCode} ${beatsresponse.SalesPersonContact}</p>
                        </div>
                    </div>
                    <a href="${whatsappurl}" target="_blank" class="chat-btn btn btn-whatsapp">
                        <em class="icon-whatsapp-o"></em>Chat Now
                    </a>
                </div>
                </div>
            `;

			if(!isMobileBrowser() && loadviewinpopup == true && pageCategory != 'Stalled_Project'){
				dev_Modal_agentModalBox += `<div class="right-body">
				<div class="lead-banner-content lead-banner">
					<div class="thankyou-banner">
						<div class="thankyou-banner-header">
						<figure> <img class="img-responsive" loading="lazy" src="/assets/images/thankyou-app.png" alt="" width="" height=""> </figure>
						<div class="text">
							<label>Your home decisions,</label>
							<strong> now <span>smarter</span><br>
							than ever </strong> </div>
						</div>
						<ul class="thankyou-features-list">
						<li class="blue"> <em class="icon-chart-o"></em> <span><strong>Data-Driven Insights</strong>Make informed decisions</span> </li>
						<li class="green"> <em class="icon-bell"></em> <span><strong>Instant Alerts</strong>Stay ahead, always</span> </li>
						<li class="yellow"> <em class="icon-idea-o"></em> <span><strong>Smart Suggestions</strong>Discover more, effortlessly</span> </li>
						<li class="purple"> <em class="icon-rupee"></em> <span><strong>Refer & Earn</strong>Upto ₹25k rewards</span> </li>
						</ul>
						<div class="stores qr-code">
						<figure> <img class="img-responsive" loading="lazy" src="/assets/images/lead-qr.svg" alt="" width="" height=""> </figure>
						<span><strong>Scan to Download App</strong>Available on <em class="icon-ios"></em> iOS & <em class="icon-android"></em> Android</span> </div>
					</div>
					</div>
					</div>`;
			}

			dev_Modal_agentModalBox += `</div></div>`;
        }

        return dev_Modal_agentModalBox;

    } else { // AGENT NOT ASSIGNED
        $(`#${modalpopupid}`).addClass("agentNotAssigned").removeClass("agentAssigned");
        $(".syFormBox .whyInvestBox").hide();

        const headingcontent = `
            <div class="thank-you-content">
				<div class="thankyou-text">
					<span class="check"><img class="img-responsive" src="/assets/images/submit-popup/thankyou-check.gif" alt=""></span>
					<h3>Thank you!</h3>
					<p>${thankyoumsg}</p>
				</div>
            </div>
        `;

        dev_Modal_agentModalBox = `
				<div class="thank-you-modal">
					<div class="dialog-modal">
                        <div class="left-body">
                            <div class="formHeading">${headingcontent}</div>
        `;


        if (formtype === "LISTING" && formid !== 'listingDetailContactAgentFormAgent') {
            if (pageCategory != 'propamcCommonServices' && ownerName && userType != "CP") {
                const tag = (userType || '').toLowerCase() == 'employee' ? "SY Expert" : "Owner";
                const ownerContact = beatsresponse.SalesPersonContact || '';
                if (!formname.includes("ViewNumber")) {
                    dev_Modal_agentModalBox += `<span class="our-agent-name"><strong>${ownerName}</strong> will reach out to you shortly</span>`;
                }
                dev_Modal_agentModalBox += `
                    <div class="agent-box">
						<figure>
							${
								listingAgentPic
									? `<img class="img-responsive" src="${listingAgentPic}" alt="${ownerName || ''}">`
									: `<span class="clr clr${getColorNum(propertyId)}">${ownerName ? ownerName[0].toUpperCase() : ''}</span>`
							}
						</figure>

						<span>
							<strong>${ownerName || ''}</strong>
							${tag}${formname.includes("ViewNumber") && ownerContact ? ` - ${ownerContact}` : ''}
						</span>
						${formname.includes("ViewNumber") && ownerContact ? `
						<div class="btn-box">
							<a href="tel:${beatsresponse.SalesPersonCountryCode || ''}${ownerContact}" class="btn btn-primary">
								<em class="icon-expert-call"></em>
							</a>
						</div>` : ''}
					</div>
                `;
            }
        }


		if(!isMobileBrowser() && loadviewinpopup == true){
			if (formtype === "PROJECT") {
				if (details && details.marketingPlan && details.marketingPlan.advertiserDetails) {
					const adv = details.marketingPlan.advertiserDetails;
				dev_Modal_agentModalBox += `
						<div class="agent-box">
							<figure>
								${
									adv.pic
										? `<img class="img-responsive" src="${adv.pic}" alt="${adv.name || ''}">`
										: `<span class="clr clr${getColorNum(propertyId)}">${adv.name ? adv.name[0].toUpperCase() : ''}</span>`
								}
							</figure>

							<span>
								<strong>${adv.name || ''}</strong>
								Agent${formname.includes("ViewNumber") ? ` - ${adv.mobile || ''}` : ''}
							</span>

							<div class="btn-box">
								<a href="tel:${adv.mobile || ''}" class="btn btn-primary">
									<em class="icon-expert-call"></em>
								</a>
							</div>
						</div>
					`;
				}
				if(formid !== 'ClientInfoForm_common_gallery'){
					dev_Modal_agentModalBox += (newdata && newdata.length) ? getSimilarPropertiesForProjects(newdata) : '';
				}
			}
			if (formtype === "LISTING") {
				dev_Modal_agentModalBox += (newdata && newdata.data) ? getSimilarProperties(newdata) : getSimilarProperties();
			}

			dev_Modal_agentModalBox += `</div>`;
			if (pageCategory != 'Stalled_Project') {
			dev_Modal_agentModalBox += `<div class="right-body">
			<div class="lead-banner-content lead-banner">
				<div class="thankyou-banner">
					<div class="thankyou-banner-header">
					<figure> <img class="img-responsive" loading="lazy" src="/assets/images/thankyou-app.png" alt="" width="" height=""> </figure>
					<div class="text">
						<label>Your home decisions,</label>
						<strong> now <span>smarter</span><br>
						than ever </strong> </div>
					</div>
					<ul class="thankyou-features-list">
					<li class="blue"> <em class="icon-chart-o"></em> <span><strong>Data-Driven Insights</strong>Make informed decisions</span> </li>
					<li class="green"> <em class="icon-bell"></em> <span><strong>Instant Alerts</strong>Stay ahead, always</span> </li>
					<li class="yellow"> <em class="icon-idea-o"></em> <span><strong>Smart Suggestions</strong>Discover more, effortlessly</span> </li>
					<li class="purple"> <em class="icon-rupee"></em> <span><strong>Refer & Earn</strong>Upto ₹25k rewards</span> </li>
					</ul>
					<div class="stores qr-code">
					<figure> <img class="img-responsive" loading="lazy" src="/assets/images/lead-qr.svg" alt="" width="" height=""> </figure>
					<span><strong>Scan to Download App</strong>Available on <em class="icon-ios"></em> iOS & <em class="icon-android"></em> Android</span> </div>
				</div>
				</div>
				</div>`;
			}
		}

		if(isMobileBrowser() || loadviewinpopup == false){
			if(formtype && formtype === 'Home_Interior'){
			}else{
				dev_Modal_agentModalBox += `
						<div class="lead-banner-content lead-banner">
						<div class="thankyou-banner">
							<div class="thankyou-banner-header">
							<figure> <img class="img-responsive" loading="lazy" src="/assets/images/thankyou-app.png" alt="" width="" height=""> </figure>
							<div class="text">
								<label>Your home decisions,</label>
								<strong> now <span>smarter</span><br>
								than ever </strong> </div>
							</div>
							<ul class="thankyou-features-list">
							<li class="blue"> <em class="icon-chart-o"></em> <span><strong>Data-Driven Insights</strong>Make informed decisions</span> </li>
							<li class="green"> <em class="icon-bell"></em> <span><strong>Instant Alerts</strong>Stay ahead, always</span> </li>
							<li class="yellow"> <em class="icon-idea-o"></em> <span><strong>Smart Suggestions</strong>Discover more, effortlessly</span> </li>
							<li class="purple"> <em class="icon-rupee"></em> <span><strong>Refer & Earn</strong>Upto ₹25k rewards</span> </li>
							</ul>
							${isMobileBrowser() ? `
								<div class="download">Click to Download app</div>
								<div class="stores">
									<a href="${appLink}" class="store">
										<img class="img-responsive" loading="lazy"
											src="/assets/images/banner-gpay-store.png"
											alt="">
									</a>
									<a href="${appLink}" class="store">
										<img class="img-responsive" loading="lazy"
											src="/assets/images/banner-app-store.png"
											alt="">
									</a>
								</div>
							` : `
								<div class="stores qr-code">
									<figure>
										<img class="img-responsive" loading="lazy"
											src="/assets/images/lead-qr.svg"
											alt="">
									</figure>
									<span>
										<strong>Scan to Download App</strong>
										Available on <em class="icon-ios"></em> iOS &
										<em class="icon-android"></em> Android
									</span>
								</div>
							`}
						</div>
						</div>
					`;
			}

			// SHOW SIMILAR PROPERTIES FOR LISTING (outside the template literal)
			if (formtype === "PROJECT") {
				if (details && details.marketingPlan && details.marketingPlan.advertiserDetails) {
					const adv = details.marketingPlan.advertiserDetails;
				dev_Modal_agentModalBox += `
						<div class="agent-box">
							<figure>
								${
									adv.pic
										? `<img class="img-responsive" src="${adv.pic}" alt="${adv.name || ''}">`
										: `<span class="clr clr${getColorNum(propertyId)}">${adv.name ? adv.name[0].toUpperCase() : ''}</span>`
								}
							</figure>
							<span>
								<strong>${adv.name || ''}</strong>
								Agent${formname.includes("ViewNumber") ? ` - ${adv.mobile || ''}` : ''}
							</span>

							<div class="btn-box">
								<a href="tel:${adv.mobile || ''}" class="btn btn-primary">
									<em class="icon-expert-call"></em>
								</a>
							</div>
						</div>
					`;
				}
				if(formid != 'ClientInfoForm_common_gallery'){
					dev_Modal_agentModalBox += (newdata && newdata.length) ? getSimilarPropertiesForProjects(newdata) : '';
				}
			}

			if (formtype === "LISTING") {
				dev_Modal_agentModalBox += (newdata && newdata.data) ? getSimilarProperties(newdata) : getSimilarProperties();
			}
			dev_Modal_agentModalBox += `</div></div>`;
		}
        return dev_Modal_agentModalBox;
    }
};

// const getglobalAgentPopupHtmlForCommonLeadForm = (beatsresponse, redirecturl, whatsappurl, thankyoumsg, formtype, formid, modalpopupid, pageCategory, countryCode, mobile, newdata, iswhatsappclick = "", whatsapptext = "") => {
// 	$(".syFormBox .whyInvestThroughSquareYards").hide();
// 	const details = getMoreInfoByPageCategory(pageCategory, formid);
// 	const userType = $(`#${formid}`).find("input[name='userType']").val();
// 	const ownerName = $(`#${formid}`).find("input[name='userName']").val();
// 	const propertyId = $(`#${formid}`).find("input[name='propertyId']").val();
// 	const listingAgentPic = $(`#${formid}`).find("input[name='profilePic']").val();
// 	const formname = $(`#${formid}`).find("input[name='dev_formname']").val() || "";

// 	if ((pageCategory != 'propamcCommonServices' && beatsresponse.SalesPersonName != undefined && beatsresponse.SalesPersonContact != undefined && beatsresponse.SalesPersonName != "" && beatsresponse.SalesPersonContact != "")) {
// 		$(`#${modalpopupid}`).addClass("agentAssigned");
// 		$(`#${modalpopupid}`).removeClass("agentNotAssigned");
// 		$(".syFormBox .whyInvestBox").hide();
// 		beatsresponse.SalesPersonCountryCode = beatsresponse.SalesPersonCountryCode.replace("+", "");

// 		let dev_Modal_agentModalBox = '<div class="agentVerified"><div class="formHeading">'
// 		+ '<div class="agentVerifiedBox"><svg class="agentVerifiedCheck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">'
// 		+ '<circle class="agentVerifiedCircle" cx="26" cy="26" r="25" fill="none"></circle>'
// 		+ '<path class="agentVerifiedChecked" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>'
// 	  + `</svg></div><strong class="enquiryHeading">${helperJS.translate('Thank you! Enquiry received successfully.') + (!formname.includes('ViewNumber') ? ` ${beatsresponse.SalesPersonName} will reach out to you shortly.` : '')}</strong></div></div>`;
//       	// dev_Modal_agentModalBox = dev_Modal_agentModalBox + '<div class="syFormBody"><div class="agentAssignee">' +
// 		// '<div class="userInfoBox">';

// 		// if(formtype == "LISTING" && details.tag != ""){
// 		// 	dev_Modal_agentModalBox = dev_Modal_agentModalBox + '<div class="syTag sy"><em class="leadformIco"></em>' + details.tag + '</div>';
// 		// }

// 		 (iswhatsappclick === "1" && whatsapptext) && (dev_Modal_agentModalBox += `<div class="nameWithStar"><span>${beatsresponse.SalesPersonName}</span></div>`);
// 		// : (formtype === "LISTING" ? '<div><figure><a href="https://squareyard.page.link/MyEnquiry"><img class="img-responsive" src="/assets/images/mobile-app-banner.png" alt="mobile-app-banner"></a></figure></div>' : '<div class="projectBanner"></div>');
// 	 if ((formtype === "LISTING" || formtype === "AGENT") && iswhatsappclick !== "1" && formid !== 'listingDetailContactAgentFormAgent') {
// 			let appLink = '';
// 			if(typeof ltype != 'undefined') {
// 				appLink = ltype === 'Sale' ? 'https://sy.sqweb.in/bohjdxng' : ltype === 'Rent' ? 'https://sy.sqweb.in/rgmcmcbc' : '';
// 			} 
// 			dev_Modal_agentModalBox
// 		+= `<div class="agentVerifiedDetails" onclick="window.location.href= '${appLink}'">`
// 			+ `<div class="headingStyle">${
// 					 formname.includes("ViewNumber")
// 					? '<span>Download our app</span> to keep contact details on your fingertips'
// 					: '<span>Download our app</span> to connect instantly and view their contact details.'
// 				 }</div>`
// 			+ `<div class="userCardDetails">`
// 				+ `<circle>${
// 				 beatsresponse.SalesPersonProfilePic
// 						? `<img class="img-responsive" src="${beatsresponse.SalesPersonProfilePic}" alt="${beatsresponse.SalesPersonName}">`
// 						: `<span class="clr clr${getColorNum(propertyId)}">${beatsresponse.SalesPersonName ? beatsresponse.SalesPersonName[0].toUpperCase() : ''}</span>`
// 				 }</circle>`
// 				+ `<div class="infoBox">`
// 					+ `<strong>${beatsresponse.SalesPersonName}</strong>`
// 					+ `<span>Agent${formname.includes('ViewNumber') ? ` - ${beatsresponse.SalesPersonContact}` : ''}</span>`
// 				+ `</div>`
// 			+ `</div>`
// 			+ `<figure><img class="img-responsive" src="/assets/images/form-mobile-app-banner-black.png" alt="mobile-app-banner"></figure>`
// 		+ `</div>`;
// 		} else if (formtype == 'PROJECT' && iswhatsappclick != "1") {
// 			dev_Modal_agentModalBox += '<div class="projectBanner"></div>';
// 	  	}

// 		if (iswhatsappclick == "1" && whatsapptext) {
// 			dev_Modal_agentModalBox = `<style>
// 				.globalOverflow{position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.7);z-index:10;display:none}
// 				.globalOverflow.active{display:block}
// 				.redirectionPopup{padding:15px;position:fixed;right:0;bottom:5000px;border-radius:15px 15px 0 0;background:#fff;left:0;z-index:15;align-items:center;justify-content:center;transition:.3s}
// 				.redirectionPopup.active{bottom:0;transition:.3s}
// 				.popupHeadingBox{padding:30px 21px 24px;min-height:48px;text-align:center;color:#333;display:block;font-size:16px;font-weight:600}
// 				.popupHeadingBox .agentVerifiedBox{margin-bottom:15px;width:100%;display:inline-block;float:left;text-align:center}
// 				.popupHeadingBox .agentVerifiedCheck{width:64px;height:64px;border-radius:50%;display:inline-block;stroke-width:4;stroke:#0E9F6E;stroke-miterlimit:10}
// 				.popupHeadingBox .agentVerifiedCircle{stroke-dasharray:166;stroke-dashoffset:166;stroke-width:5;stroke-miterlimit:10;stroke:#0E9F6E;fill:none;animation:stroke .6s cubic-bezier(0.65,0,0.45,1) forwards}
// 				.popupHeadingBox .agentVerifiedChecked{transform-origin:50% 50%;stroke-dasharray:48;stroke-dashoffset:48;animation:stroke .3s cubic-bezier(0.65,0,0.45,1) .8s forwards;stroke-linecap:round;stroke-linejoin:round}
// 				.popupHeadingBox strong{color:#333;font-size:16px;text-align:center;line-height:24px}
// 				.redirectionPopup .closeBtn{width:14px;height:14px;position:absolute;right:13px;top:13px;cursor:pointer}
// 				.redirectionPopup .closeBtn em.close{position:relative;display:flex;width:100%;height:100%}
// 				.redirectionPopup .closeBtn em::before{transform:rotate(-45deg)}
// 				.redirectionPopup .closeBtn em::after{transform:rotate(45deg)}
// 				.redirectionPopup .closeBtn em::after,.redirectionPopup .closeBtn em::before{height:13px;width:1px;position:absolute;background:#909090;content:''}
// 				.whatsappPopupBody .cardBox .tagBox .ico-crown{background-position:-25px -4px;background:url(/assets/images/sprite-icon/agent-tile.svg) no-repeat;background-size:150px;overflow:hidden;display:block}
// 				.whatsappPopupBody .cardBox{margin-bottom:18px;padding:15px;border:1px solid #e6e6e6;border-radius:8px;background:#fff;display:flex;align-items:center}
// 				.whatsappPopupBody .cardBox .tagBox{background:#fbc200;width:18px;height:18px;display:flex;align-items:center;justify-content:center;border:solid 1px #fff;border-radius:100%;position:absolute;right:0;top:0}
// 				.whatsappPopupBody .cardBox .tagBox em{display:block;width:16px;height:10px}
// 				.whatsappPopupBody .cardBox .tagBox .ico-crown{background-position:-25px -4px}
// 				.whatsappPopupBody .agentPic{margin-right:14px;width:66px;height:66px;border-radius:100%;position:relative}
// 				.whatsappPopupBody .agentPic img{background:#fbc200;padding:3px;border-radius:100%;object-fit:cover;width:100%;height:100%}
// 				.whatsappPopupBody .agentPic small.clr{border-radius:100%;font-size:25px}
// 				.whatsappPopupBody .cardContent p{margin-bottom:4px;color:#666;font-size:10px;line-height:normal;text-align:left}
// 				.whatsappPopupBody .cardContent strong{margin-bottom:5px;color:#333;font-size:14px;font-weight:700;text-align:left}
// 				.whatsappPopupBody .cardContent span{font-size:12px;color:#333}
// 				.whatsappPopupBody p{margin-bottom:6px;font-size:16px;color:#333;text-align:center}
// 				.whatsappPopupBody strong{margin-bottom:10px;color:#1f1f1f;font-size:34px;font-weight:700;line-height:normal;text-align:center;display:block}
// 				.whatsappPopupBody .chat-btn{width:100%;outline:none;color:#fff;border:none;background-image:linear-gradient(#4cc75b 96%,#30b845 3%);height:44px;border-radius:8px;font-size:14px;display:flex;justify-content:center;align-items:center;cursor:pointer}
// 				.whatsappPopupBody .chat-btn em{margin-right:21px;width:30px;height:30px;background-size:230px}
// 				.whatsappPopupBody .chat-btn .ico-whatsapp{background-position:-3px -150px}
// 				.chat-btn .agent-ico{background:url(/assets/images/sprite-icon/agent-tile.svg) no-repeat;background-size:150px;overflow:hidden;display:block}
// 				@keyframes stroke {
// 				100%{stroke-dashoffset:0}
// 				}
// 				@keyframes verifiedcheck {
// 				0%{width:100%}
// 				100%{width:20px}
// 				}
// 			</style>
// 			<div class="popupHeadingBox" id="agentWhatsAppRedirectPopup">
// 				<div class="agentVerifiedBox">
// 					<svg class="agentVerifiedCheck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
// 						<circle class="agentVerifiedCircle" cx="26" cy="26" r="25" fill="none"></circle>
// 						<path class="agentVerifiedChecked" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
// 					</svg>
// 				</div>
// 				<strong>${beatsresponse.SalesPersonName} will call you soon</strong><br>
// 				or<br>
// 				Chat instantly on WhatsApp.
// 			</div>
// 			<div class="whatsappPopupBody">
// 			<div class="cardBox">
// 				<figure class="agentPic">
// 					<div class="tagBox"><em class="agent-ico ico-crown"></em></div>
// 					${
// 	beatsresponse.SalesPersonProfilePic
// 		?						`<img class="img-responsive" src="${beatsresponse.SalesPersonProfilePic}" alt="" height="64" width="64"/>`
// 		:						`<small class="clr clr${getColorNum(beatsresponse.SalesPersonContact)}">${beatsresponse.SalesPersonName ? beatsresponse.SalesPersonName[0].toUpperCase() : 'N/A'}</small>`
// }
// 				</figure>
// 				<div class="cardContent">
// 					<strong>${beatsresponse.SalesPersonName}</strong>
// 					<p>+${beatsresponse.SalesPersonCountryCode} ${beatsresponse.SalesPersonContact}</p>
// 				</div>
// 			</div>
// 			<a target="_blank" href="${whatsappurl}" id="agentWhatsappChatBtn" class="chat-btn"><em class="agent-ico ico-whatsapp"></em>Chat Now</a></div>`;
// 		} else {
// 			if (formtype != '' && formtype == 'LISTING') {
// 				((newdata && newdata.data) ? dev_Modal_agentModalBox += getSimilarProperties(newdata) :	dev_Modal_agentModalBox += getSimilarProperties());
// 			}
// 		}

// 		dev_Modal_agentModalBox += '</div>';

// 	    return dev_Modal_agentModalBox;
// 	} else if ((pageCategory != 'propamcCommonServices' && ownerName && userType != "CP")) {
// 		$(`#${modalpopupid}`).addClass("agentNotAssigned");
// 		$(`#${modalpopupid}`).removeClass("agentAssigned");
// 		$(".syFormBox .whyInvestBox").hide();
// 		const headingcontent = '<div class="agentVerifiedBox"><svg class="agentVerifiedCheck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">'
// 		+ '<circle class="agentVerifiedCircle" cx="26" cy="26" r="25" fill="none"></circle>'
// 		+ '<path class="agentVerifiedChecked" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>'
// 	   + `</svg></div><strong class="enquiryHeading">${helperJS.translate('Thank you! Enquiry received successfully.') + (!formname.includes('ViewNumber') ? ` ${ownerName} will reach out to you shortly.` : '')}</strong>`;

// 		let dev_Modal_agentModalBox = `<div class="agentVerified"><div class="formHeading">${headingcontent}</div></div>`;

// 		if (formtype != '' && formtype == 'PROJECT') {
// 			const location = $(`#${formid} select[name='location']`).val();
// 			if (typeof pageCategory != 'undefined' && (pageCategory == 'vastu' || pageCategory == 'rent-furniture' || pageCategory == 'rent-appliances' || pageCategory == 'solar-rooftop' || pageCategory == 'property-inspection' || pageCategory == 'azuroPage' || pageCategory == "painting-services" || pageCategory == "commonBanner" || pageCategory == 'PROPTV')) {
// 			} else {
// 				dev_Modal_agentModalBox += '<div class="projectBanner"></div>';
// 			}
// 		}

// 		if (formtype !== '' && formtype === 'LISTING' && formid !== 'listingDetailContactAgentFormAgent') {
// 			const appLink = ltype === 'Sale' ? 'https://sy.sqweb.in/bohjdxng' : ltype === 'Rent' ? 'https://sy.sqweb.in/rgmcmcbc' : '';
// 			dev_Modal_agentModalBox
// 			+= `<div class="agentVerifiedDetails" onclick="window.location.href= '${appLink}'">`
// 				+ `<div class="headingStyle">${
// 					 formname.includes("ViewNumber")
// 						? '<span>Download our app</span> to keep contact details on your fingertips'
// 						: '<span>Download our app</span> to connect instantly and view their contact details.'
// 				 }</div>`
// 				+ `<div class="userCardDetails">`
// 					+ `<circle>${
// 					 listingAgentPic
// 							? `<img class="img-responsive" src="${listingAgentPic}" alt="${ownerName}">`
// 							: `<span class="clr clr${getColorNum(propertyId)}">${ownerName ? ownerName[0].toUpperCase() : ''}</span>`
// 					 }</circle>`
// 					+ `<div class="infoBox"><strong>${ownerName}</strong> <span>Owner</span></div>`
// 				+ `</div>`
// 				+ `<figure><img class="img-responsive" src="/assets/images/form-mobile-app-banner-black.png" alt="mobile-app-banner"></figure>`
// 			+ `</div>`;

// 			dev_Modal_agentModalBox += (newdata && newdata.data) ? getSimilarProperties(newdata) : getSimilarProperties();
// 		}

// 	   	return dev_Modal_agentModalBox;
// 	} else {
// 		$(`#${modalpopupid}`).addClass("agentNotAssigned");
// 		$(`#${modalpopupid}`).removeClass("agentAssigned");
// 		$(".syFormBox .whyInvestBox").hide();
// 		 const headingcontent = `
// 		 <div class="agentVerifiedBox">
// 			 <svg class="agentVerifiedCheck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
// 				 <circle class="agentVerifiedCircle" cx="26" cy="26" r="25" fill="none" />
// 				 <path class="agentVerifiedChecked" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
// 			 </svg>
// 		 </div>
// 		 <strong ${formtype == 'PROJECT' ? "class='enquiryHeading'" : ""}>
// 			 ${thankyoumsg}
// 			 ${formtype == 'PROJECT' && pageCategory != "Di_alert" ? "<span class='span'> One of our representative will be reaching out shortly </span>" : pageCategory == "Di_alert" ? "<span class='span'> You'll soon start getting updates on mail/whatsapp </span>" : ""}
// 		 </strong>`;

// 		let dev_Modal_agentModalBox = `<div class="agentVerified"><div class="formHeading">${headingcontent}</div>`
// 		+ `</div>`;

// 		if (formtype != '' && formtype == 'PROJECT') {
// 			$(`#${modalpopupid}`).addClass("agentAssigned");
// 		   $(`#${modalpopupid}`).removeClass("agentNotAssigned");
// 			const location = $(`#${formid} select[name='location']`).val();
// 			if (typeof pageCategory != 'undefined' && (pageCategory == 'vastu' || pageCategory == 'rent-furniture' || pageCategory == 'rent-appliances' || pageCategory == 'solar-rooftop' || pageCategory == 'property-inspection' || pageCategory == 'azuroPage' || pageCategory == "painting-services" || pageCategory == "commonBanner" || pageCategory == 'PROPTV')) {
// 			} else if (pageCategory != "Di_alert") {
// 				dev_Modal_agentModalBox +=
// 				'<div class="agentVerifiedDetails" onclick="window.location.href=\'https://sy.sqweb.in/dzybzore\'">' +
// 					'<div class="headingStyle">' +
// 					'<span>Download our app</span> to keep contact details on your fingertips' +
// 					'</div>';
// 				if (details && details.marketingPlan && Object.keys(details.marketingPlan).length > 0) {
// 				dev_Modal_agentModalBox +=
// 					'<div class="userCardDetails">' +
// 					'<circle>' +
// 						'<span class="clr clr' + getColorNum(propertyId) + '">' +
// 						((details.marketingPlan.advertiserDetails && details.marketingPlan.advertiserDetails.name)
// 							? details.marketingPlan.advertiserDetails.name[0].toUpperCase()
// 							: '') +
// 						'</span>' +
// 					'</circle>' +
// 					'<div class="infoBox">' +
// 						'<strong>' +
// 						((details.marketingPlan.advertiserDetails && details.marketingPlan.advertiserDetails.name)
// 							? details.marketingPlan.advertiserDetails.name
// 							: '') +
// 						'</strong>' +
// 						'<span>' +
// 						((details.marketingPlan.advertiserDetails && details.marketingPlan.advertiserDetails.mobile)
// 							? details.marketingPlan.advertiserDetails.mobile
// 							: '') +
// 						'</span>' +
// 					'</div>' +
// 					'</div>';
// 				}
// 				dev_Modal_agentModalBox +=
// 				'<figure><img class="img-responsive" src="/assets/images/form-mobile-app-banner-black.png" alt="mobile-app-banner"></figure>' +
// 				'</div>';
// 				((newdata && newdata.length) ? dev_Modal_agentModalBox += getSimilarPropertiesForProjects(newdata) : dev_Modal_agentModalBox += getSimilarPropertiesForProjects());
// 			} else {
// 				dev_Modal_agentModalBox += '<div class="agentVerifiedDetails" onclick="window.location.href=\'https://sy.sqweb.in/dzybzore\'">' + ' <div class="headingStyle"> <span>Download our app</span> to stay updated with the latest price & property trends.</div><figure><img class="img-responsive" src="/assets/images/form-mobile-app-banner-black.png" alt="mobile-app-banner"></figure></div>';
// 			}
// 			$(document).on("click", ".syFormBox .pUnitTile .moreUnit", function () {
// 				$(this).closest(".pUnitTile").find(".pTable").addClass("active");
// 				$(this).remove();
// 			});
// 		}

// 		if (formtype != '' && formtype == 'LISTING' && typeof ltype !== "undefined") {
// 			const appLink = ltype === 'Sale' ? 'https://sy.sqweb.in/bohjdxng' : ltype === 'Rent' ? 'https://sy.sqweb.in/rgmcmcbc' : '';
// 			dev_Modal_agentModalBox += `<div class="agentVerifiedDetails" onclick="window.location.href= '${appLink}'">`
// 			+ ` <div class="headingStyle"> <span>Download our app</span> to connect instantly and view their contact details. </div>`
// 			 + `<div class="userCardDetails">`
// 			 + `<figure><img class="img-responsive" src="/assets/images/form-mobile-app-banner-black.png" alt="mobile-app-banner"></figure></div>`;
// 			((newdata && newdata.data) ? dev_Modal_agentModalBox += getSimilarProperties(newdata) :	dev_Modal_agentModalBox += getSimilarProperties());
// 		}

// 	   	return dev_Modal_agentModalBox;
// 	}
// };

async function similarPropertiesDse(propertyId, dsePagetype) {
	if (dsePagetype != '' && (dsePagetype == 'LISTINGRESALE' || dsePagetype == "LISTINGRESALEDETAIL" || dsePagetype == "RECOMMENDATIONRESALELISTING")) {
		categoryId = '2';
	} else if (dsePagetype != '' && (dsePagetype == "LISTINGRENTAL" || dsePagetype == "LISTINGRENTALDETAIL" || dsePagetype == "RECOMMENDATIONRENTALLISTING")) {
		categoryId = '3';
	} else if (dsePagetype != '' && (dsePagetype == "DSE" || dsePagetype == "RECOMMENDATIONNEWPROJECTLISTING" || dsePagetype == "New_Project_Detail")) {
		categoryId = '1';
	}
	if (typeof propertyId != 'undefined' && typeof dsePagetype != 'undefined' && categoryId != '') {
		return new Promise((resolve, reject) => {
			$.ajax({
				type: "POST",
				url: "/getsimilarproperties",
				data: { propertyId, categoryId },
				success(response) {
					resolve(response);
				},
				error(xhr, error) {
					reject(error);
				 }
		   });
		});
	}
}

const afterglobalVerification = async (countryCode, mobile, beatsresponse, pageCategory, formboxid, formid, changeNumberformid, otpboxformid, modalpopupid, redirecturl, isdsepage, propAmcData, propAmcType, PriceHisoryPageData, iscommonleadform, _userData, formtype, apiResp, apiResp_agentdata, propamcCommonTicketResponse, propertyId, dsePagetype,loadviewinpopup, compareResp = '', interiorEstimateResp = {}) => {
	newdata = await similarPropertiesDse(propertyId, dsePagetype);
	if (formtype == "LISTING") {
		if (apiResp_agentdata != undefined) {
			const agentmobnoarr = apiResp_agentdata.agentMobileNo ? apiResp_agentdata.agentMobileNo.split("+91") : [];
			let agentMobileNo = "";
			let agentCountryCode = "";
			if (apiResp_agentdata.agentMobile) {
				agentCountryCode = apiResp_agentdata.agentCountryCode ? `+${String(apiResp_agentdata.agentCountryCode).replace("+", "")}` : "";
				agentMobileNo = apiResp_agentdata.agentMobile;
			} else if (agentmobnoarr.length == 2) {
				agentCountryCode = "+91";
				agentMobileNo = agentmobnoarr[1];
			}

			beatsresponse = {};
			if (apiResp_agentdata.agentName != "undefined") {
				beatsresponse.SalesPersonName = apiResp_agentdata.agentName;
			} else {
				beatsresponse.SalesPersonName = "";
			}
			beatsresponse.SalesPersonContact = agentMobileNo;
			beatsresponse.SalesPersonCountryCode = agentCountryCode;
			if (apiResp_agentdata.agentImage != undefined) {
				beatsresponse.SalesPersonProfilePic = apiResp_agentdata.agentImage;
			} else {
				beatsresponse.SalesPersonProfilePic = "";
			}
		} else {
			beatsresponse = { SalesPersonName: "", SalesPersonContact: "", SalesPersonCountryCode: "", SalesPersonProfilePic: "" };
		}
	}

	if (formtype == "AGENT") {
		if (apiResp_agentdata != undefined) {
			const agentmobnoarr = apiResp_agentdata.agentMobileNo ? apiResp_agentdata.agentMobileNo.split("+91") : [];
			let agentMobileNo = "";
			let agentCountryCode = "";
			if (apiResp_agentdata.agentMobile) {
				agentCountryCode = apiResp_agentdata.agentCountryCode ? `+${String(apiResp_agentdata.agentCountryCode).replace("+", "")}` : "";
				agentMobileNo = apiResp_agentdata.agentMobile;
			} else if (agentmobnoarr.length == 2) {
				agentCountryCode = "+91";
				agentMobileNo = agentmobnoarr[1];
			}

			beatsresponse = {};
			if (apiResp_agentdata.agentName != "undefined") {
				beatsresponse.SalesPersonName = apiResp_agentdata.agentName;
			} else {
				beatsresponse.SalesPersonName = "";
			}
			beatsresponse.SalesPersonContact = agentMobileNo;
			beatsresponse.SalesPersonCountryCode = agentCountryCode;
			if (apiResp_agentdata.agentImage != undefined) {
				beatsresponse.SalesPersonProfilePic = apiResp_agentdata.agentImage;
			} else {
				beatsresponse.SalesPersonProfilePic = "";
			}
		} else {
			beatsresponse = { SalesPersonName: "", SalesPersonContact: "", SalesPersonCountryCode: "", SalesPersonProfilePic: "" };
		}
	}

	const dataLayer = window.dataLayer || [];

	dataLayer.push({
				  CPageType: pageCategory
	});

	if (globalfn.globaltimeinterval) {
		clearInterval(globalfn.globaltimeinterval);
	}

	$(`#${otpboxformid}`).removeClass('active');
	$(`#${formboxid}`).removeClass('active');

	if ($(`#${formid}_leadForm`).length > 0) {
               		$(".overLayBox,.globalOverflow").addClass("active"); $("body").addClass("scroll-lock");
	}

	if (isdsepage == true) {
		        	$(`#${formid}`).addClass("active");
		            $(`#${otpboxformid}`).removeClass("active");
		            $(`#${changeNumberformid}`).removeClass("active");
		            $(`#${modalpopupid}`).removeClass("active");
		        }

	if (formtype == 'LISTING' || pageCategory == 'DSE-GALLERY') {
		$(`#${formboxid}`).addClass('active');
	}

		        if (pageCategory == "PROJECT-FACTSHEET") {
		        	$.ajax({
				    	type: "POST",
				       	url: "/client-doc-list",
				        data: { projectId: $("#hd_pid").val() },
				        success(docres) {
				        	// console.log(docres);
				        	if (docres.status == 1) {
				        		if (docres.data != undefined) {
				        			const docs = docres.data.filter((fe) => fe.Id == 4);
				        			if (docs.length > 0) {
				        				if (docs[0].Documents != undefined) {
				        					if (docs[0].Documents.length > 0) {
				        						const docurl = docs[0].Documents[0].Url;
				        						window.open(docurl, '_blank');
				        					}
				        				}
				        			}
				        		}
				        	}

				        	$('#dev_popupform_factsheet,div.overLayBox,.globalOverflow').removeClass('active'); $('body').removeClass('active scroll-lock');
				        },
				        error(xhr, error) {
				        	helperJS.alertBox('error', "something went wrong");
				        	// $("#" + otpboxformid + " .otpError").html("something went wrong");
				        	$('#loaderBox').hide();
				 		}
			   		});
	} else if (pageCategory == "PROPAMC" || pageCategory == "propamcProject" || pageCategory == 'detailPages') {
		if (PriceHisoryPageData != undefined) {
			transactionData.sale = PriceHisoryPageData[0];
			transactionData.lease = PriceHisoryPageData[1];
			transactionData.newProject = PriceHisoryPageData[2];
			if (beatsresponse != undefined) {
				window.formFilled = "form Filled";
			}
			const owlCarousel = parseInt($(`#${formboxid} input[name='owlCarousel']`).val());
			renderPriceHistoryData(propAmcType, formFilled, pageCategory, owlCarousel);
			$('.overLayBox,.globalOverflow').removeClass('active');
			$(`#${formid}_leadForm`).removeClass("active");
		}
		if (propAmcData != undefined && propAmcData.success) {
			if (propAmcType == "propamcProject") {
				$('.gblPpup.transactionLogin,.globalModal.transactionLogin').removeClass('active');
				$('.gblPpup.transactionLogin .formBox,.globalModal.transactionLogin .formBox').removeClass('active');
				$('.transactionLoginBox').hide();
				$('.overLayBox,.globalOverflow').removeClass('active');
				renderTransactionDataTable(propAmcData.data, propAmcType);
			}
		}
	} else if (pageCategory == "COMPARE") {
		$('#loaderBox').hide();
		function downloadFileObject(base64PDF) {
			if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
				const bytes = atob(base64PDF);
				const buf = new Uint8Array(bytes.length);
				for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i);
				const blobUrl = URL.createObjectURL(new Blob([buf], { type: 'application/pdf' }));
				window.location.href = blobUrl;
				return;
			}
			const linkSource = `data:application/pdf;base64,${base64PDF}`;
			const downloadLink = document.createElement("a");
			const fileName = "convertedPDFFile.pdf";
			downloadLink.href = linkSource;
			downloadLink.download = fileName;
			downloadLink.click();
						  }

						  if (compareResp && compareResp.base64PDF) {
						 	 downloadFileObject(compareResp.base64PDF);
						  	$('#downloadReportModal,#dev_popupform_compare,div.overLayBox,.globalOverflow,.modal-overlay').removeClass('active'); $('body').removeClass('active scroll-lock');
						  }
	} else if (formid === 'ReraClientInfoForm') {
		if (window.selReraDoc && typeof reraDetails != 'undefined' && reraDetails && Object.keys(reraDetails).length) {
			const reraResponseObj = window.selReraDoc;
			reraResponseObj.reraToken = reraDetails.reraToken;
			$.ajax({
				async: true,
				contentType: "application/json",
				data: JSON.stringify(reraResponseObj),
				success(data) {
					if (data && data.status && (data.url || data.pdfData) && typeof loadReraDocument != 'undefined') {
						loadReraDocument(data, reraResponseObj.openDocType);
					}
				},
				error(error) {
					console.log(error);
				},
				type: "POST",
				url: "/authenticate-rera"
			});
		}
		$('div.overLayBox,.globalOverflow').removeClass('active'); $('body').removeClass('active scroll-lock');
	} else if (pageCategory == "vastu") {
		$('#ClientInfoForm_projectpopup_leadForm,div.overLayBox,.globalOverflow').removeClass('active'); $('body').removeClass('active scroll-lock');
		downloadGeneratedPDF();
	} else if(formtype && formtype == 'Home_Interior'){
		$('#loaderBox').hide();
		if (typeof intShowSuccess === 'function') {
			intShowSuccess(interiorEstimateResp);
		}
	} else if (beatsresponse.SalesPersonName != undefined && beatsresponse.SalesPersonContact != undefined && beatsresponse.SalesPersonContact != "") {
		let whatsapptext = "";
		if (formtype == "LISTING" || formtype == "AGENT") {
				let hitext = "Hi,";
				if (beatsresponse.SalesPersonName != undefined) {
				hitext = `Hi ${beatsresponse.SalesPersonName},`;
				}
				const propertyLink = $(`#${formid} input#formPropertyLink`).val();
				whatsapptext = `${hitext}%0A%0AI am interested in your listing - ${propertyLink} on Square Yards.%0A%0A`
				+ `I look forward to your assistance in my home search. Please get in touch with me at ${
				countryCode}-${mobile} to initiate the process.`;
		} else {
			whatsapptext = `Hi ${beatsresponse.SalesPersonName},%0A%0A`
			+ `I got connected to you on Squareyards.com.%0A%0ALook forward to your assistance `
			+ `in my home search and ownership journey. Please get back to me so we can take `
			+ `this ahead.`
			+ ` Thanks.`;
		}

		let whatsappUrl = 'https://web.whatsapp.com/';
		if (isMobileBrowser()) {
			whatsappUrl = 'https://api.whatsapp.com/';
		}
		const whatsappurl = `${whatsappUrl}send?phone=${beatsresponse.SalesPersonCountryCode}${beatsresponse.SalesPersonContact}&text=${whatsapptext}&source=&data=`;

		let dev_Modal_agentModalBox = "";

		let iswhatsappclick = "0";

		if ($(`#${formid} input[name='iswhatsappclick']`).length > 0) {
			iswhatsappclick = $(`#${formid} input[name='iswhatsappclick']`).attr("value");
		}


		if (typeof iscommonleadform != 'undefined' && iscommonleadform == true) {
			dev_Modal_agentModalBox = getglobalAgentPopupHtmlForCommonLeadForm(beatsresponse, redirecturl, whatsappurl, '', formtype, formid, modalpopupid, pageCategory, countryCode, mobile, newdata, iswhatsappclick, whatsapptext,loadviewinpopup);
		} else if (isdsepage == true) {
			dev_Modal_agentModalBox = getglobalAgentPopupHtmlForDSE(beatsresponse, redirecturl, whatsappurl);
		} else {
			dev_Modal_agentModalBox = getglobalAgentPopupHtml(beatsresponse, redirecturl, whatsappurl);
		}

		$(`#${modalpopupid}`).html(dev_Modal_agentModalBox);

		if (iswhatsappclick == "1") {
			$('div.whatsappEditBox button').on('click', function () {
				$(this).remove();
				const chatData = $('#whatsAppChatBox').val();
				$('#whatsAppChatBox').prop('disabled', false).focus().val('').val(chatData);
			});
			$('#whatsAppChatBox').bind('input propertychange', function () {
				$(this).parent().siblings('.formBtnBox').children('a.btn.btn-whatsapp').attr('href', `${whatsappUrl}send?phone="${beatsresponse.SalesPersonCountryCode + beatsresponse.SalesPersonContact}"&text="${encodeURI(this.value)}"&source=&data="`);
			});
		}

		if ($('#ourServiceSlider').length > 0) {
			$(".enquiredPropertyBox").css("display", "none");
		}

		if (isMobileBrowser() == false && $(`#${modalpopupid} .suggestedSlider`).length > 0) {
			if (typeof owlCarousel === 'function') {
				$(`#${modalpopupid} .suggestedSlider`).owlCarousel('destroy');
				$(`#${modalpopupid} .suggestedSlider`).owlCarousel({
					loop: false,
					items: 1,
					nav: true,
					dots: false,
					autoWidth: true
				});
			} else {
				globalfn.loadcssfile('/assets/lib/css/owl.carousel.min.css');
				globalfn.loadcssfile('/assets/lib/css/owl.theme.default.min.css');

				$.getScript("/assets/lib/js/owl.carousel.min.js", () => {
					$(`#${modalpopupid} .suggestedSlider`).owlCarousel('destroy');
					$(`#${modalpopupid} .suggestedSlider`).owlCarousel({
						loop: false,
						items: 1,
						nav: true,
						dots: false,
						autoWidth: true
					});
				});
			}
		}
		if (isMobileBrowser() == false && $('#ourServiceSlider').length > 0) {
			if (typeof owlCarousel === 'function') {
				$('#ourServiceSlider').owlCarousel('destroy');
				$('#ourServiceSlider').owlCarousel({
					loop: false,
					autoplay: false,
					autoplayTimeout: 1500,
					nav: true,
					dots: false,
					responsiveClass: true,
					responsive: {
						0: {
							items: 1.2,
							margin: 0
						},
						600: {
							items: 3
						},
						1280: {
							items: 3
						}
					}
				});
			} else {
				globalfn.loadcssfile('/assets/lib/css/owl.carousel.min.css');
				globalfn.loadcssfile('/assets/lib/css/owl.theme.default.min.css');

				$.getScript("/assets/lib/js/owl.carousel.min.js", () => {
					$('#ourServiceSlider').owlCarousel('destroy');
					$('#ourServiceSlider').owlCarousel({
						loop: false,
						autoplay: false,
						autoplayTimeout: 1500,
						nav: true,
						dots: false,
						responsiveClass: true,
						responsive: {
							0: {
								items: 1.2,
								margin: 0
							},
							600: {
								items: 3
							},
							1280: {
								items: 3
							}
						}
					});
				});
			}
		}
		$(`#${modalpopupid}`).addClass("active");
		$(`#${formid}_leadForm`).addClass("active");
		$(`#${formid}_formbody`).hide();
		$(`#${formid}_heading,#dev_home_propertytabbox`).hide();

		if ($(".globalModal.listingdsePopup.active").length > 0) {
			$(".galleryLeadBox").addClass("active");
		}

		if ($(`#${modalpopupid}`).hasClass("agentAssigned") == true) {
			setTimeout(() => {
				$(".syFormBox .agentEnquired .formHeading.active .agentVerifiedCheck").hide;
				// $(".syFormBox .agentEnquired .formHeading").addClass("active");
				$(".syFormBox .agentEnquired .syFormBody").addClass("active");
			}, 4000);
		}

		$(`#${formid}_alreadyLead`).removeClass("active");

		if ($(`#${formid}_leadForm`).length > 0) {
			$(".overLayBox,.globalOverflow").addClass("active"); $("body").addClass("scroll-lock");
		}

		$('body').on('click', 'div.closeAgentModalPopup', () => {
			$('div.agentModalBox').removeClass('active');
			$('div.overLayBox,.globalOverflow').removeClass('active'); $('body').removeClass('active scroll-lock');
			$(`#${modalpopupid}`).html('');
			$(`#${modalpopupid}`).removeClass('active');
			$('.popupGallery .rightForm,.MapForm').removeClass('active');
		});

		if (formtype == "LISTING") {
			let leadId = 0;
			if (apiResp && apiResp[0] && parseInt(apiResp[0].leadId)) {
			leadId = parseInt(apiResp[0].leadId);
			}
			if (leadId > 0) {
				$(`#${modalpopupid} .syForm`).find(".agentBtnBox a").off("click");
				$(`#${modalpopupid} .syForm`).find(".agentBtnBox a").on('click', function () {
					let interactionType = 0;
					if ($(this).hasClass('in-whatsapp')) {
						interactionType = 129;
					}
					if ($(this).hasClass('in-call')) {
						interactionType = 128;
					}
					if (interactionType > 0) {
					$.ajax({
						url: `${baseUrl}/user-activity-fetch`,
						dataType: "json",
						data: {
							interactionType,
							leadId
						},
						type: "POST",
						success(data) {
						}
					});
					}
				});
			}
		}

		if (isdsepage == true) {
			$(`#${modalpopupid}`).addClass("active");
				$(".gblPpup .gblOrflw, .ldBxClsBtn").off("click");
				$(".gblPpup .gblOrflw, .ldBxClsBtn").on("click", () => {
				$(".gblPpup,div.overLayBox,.globalOverflow").removeClass("active"); $("body").removeClass("active scroll-lock");
				$(`#${formid}`).removeClass("active");
			});

			if (formid.indexOf("_dsepopup") == -1) {
				$(`#${formid}`).removeClass("active");
			}
		} else {
			$(`#${formboxid}`).parent(".popupForm.active").removeClass('active');
		}
	} else {
	    let thankyoumsg = `${helperJS.translate("Your Enquiry Has Been Received")}`;
		if (formtype == "PROJECT") {
			thankyoumsg = " Enquiry Received Successfully";
			if(pageCategory == 'COST-OF-LIVING-CALCULATOR-PDF' && window.isDownloadClicked == true) {
				thankyoumsg = " Report Downloaded Successfully";
				if (window.calculator) {
					window.userName = _userData.userName;		
					window.calculator.downloadPdfReport();
					window.isDownloadClicked = false;
				}		
			}
		}
		if (pageCategory == "propamcCommonServices") {
			thankyoumsg = thankyoumsg.replace("Property", "Domain");
		}
		if (pageCategory == "PROPTV") {
			thankyoumsg = "Enquiry Received Successfully";
		}
		if (pageCategory == "movers-packers" || pageCategory == "rent-furniture" || pageCategory == "rent-appliances" || pageCategory == "solar-rooftop" || pageCategory == "property-inspection" || pageCategory == "painting-services") {
			thankyoumsg = "Congratulations! We are thrilled to receive your request. Just Sit Back & Relax. Our partners will get in touch with you shortly";
		}
		if (pageCategory == 'commonBanner') {
			thankyoumsg = "Our team will be in touch with you shortly to fulfill your requirements.";
		}
		if (pageCategory == 'Di_alert') {
			thankyoumsg = "Request Recieved Successfully";
		}
		if (formtype == "AGENT" && formid == "agentRatingForm") {
			thankyoumsg = "Review Submitted Successfully";
		}
		let dev_Modal_agentModalBox = "";

		if (typeof iscommonleadform != 'undefined' && iscommonleadform == true) {
			dev_Modal_agentModalBox = getglobalAgentPopupHtmlForCommonLeadForm(beatsresponse, redirecturl, '', thankyoumsg, formtype, formid, modalpopupid, pageCategory, countryCode, mobile, newdata,iswhatsappclick = "", whatsapptext = "", loadviewinpopup);
		} else if (isdsepage == true) {
			dev_Modal_agentModalBox = getglobalAgentPopupHtmlForDSE(beatsresponse, redirecturl, '', thankyoumsg);
		} else {
			console.log("dsadsa")
			dev_Modal_agentModalBox = getglobalAgentPopupHtml(beatsresponse, redirecturl, '', thankyoumsg);
		}

		$(`#${modalpopupid}`).html(dev_Modal_agentModalBox);

		if ($('#ourServiceSlider').length > 0) {
			$(".enquiredPropertyBox").css("display", "none");
		}
		if (isMobileBrowser() == false && $(`#${modalpopupid} .suggestedSlider`).length > 0) {
			if (typeof owlCarousel === 'function') {
				$(`#${modalpopupid} .suggestedSlider`).owlCarousel('destroy');
				$(`#${modalpopupid} .suggestedSlider`).owlCarousel({
					loop: false,
					items: 1,
					nav: true,
					dots: false,
					autoWidth: true
				});
			} else {
				globalfn.loadcssfile('/assets/lib/css/owl.carousel.min.css');
				globalfn.loadcssfile('/assets/lib/css/owl.theme.default.min.css');

				$.getScript("/assets/lib/js/owl.carousel.min.js", () => {
					$(`#${modalpopupid} .suggestedSlider`).owlCarousel('destroy');
					$(`#${modalpopupid} .suggestedSlider`).owlCarousel({
						loop: false,
						items: 1,
						nav: true,
						dots: false,
						autoWidth: true
					});
				});
			}
		}
		if (isMobileBrowser() == false && $('#ourServiceSlider').length > 0) {
			if (typeof owlCarousel === 'function') {
				$('#ourServiceSlider').owlCarousel('destroy');
				$('#ourServiceSlider').owlCarousel({
					loop: false,
					autoplay: false,
					autoplayTimeout: 1500,
					nav: true,
					dots: false,
					responsiveClass: true,
					responsive: {
						0: {
							items: 1.2,
							margin: 0
						},
						600: {
							items: 3
						},
						1280: {
							items: 3
						}
					}
				});
			} else {
				globalfn.loadcssfile('/assets/lib/css/owl.carousel.min.css');
				globalfn.loadcssfile('/assets/lib/css/owl.theme.default.min.css');

				$.getScript("/assets/lib/js/owl.carousel.min.js", () => {
					$(`#${modalpopupid} #ourServiceSlider`).owlCarousel('destroy');
					$(`#${modalpopupid} #ourServiceSlider`).owlCarousel({
						loop: false,
						autoplay: false,
						autoplayTimeout: 1500,
						nav: true,
						dots: false,
						responsiveClass: true,
						responsive: {
							0: {
								items: 1.2,
								margin: 0
							},
							600: {
								items: 3
							},
							1280: {
								items: 3
							}
						}
					});
				});
			}
		}
		$(`#${modalpopupid}`).addClass("active");
		$(`#${formid}_leadForm`).addClass("active");
		$(`#${formid}_formbody`).hide();
		$(`#${formid}_heading,#dev_home_propertytabbox`).hide();

		if ($(".globalModal.listingdsePopup.active").length > 0) {
			$(".galleryLeadBox").addClass("active");
		}

		if ($(`#${modalpopupid}`).hasClass("agentAssigned") == true) {
			setTimeout(() => {
				$(".syFormBox .agentEnquired .formHeading.active .agentVerifiedCheck").hide;
				// $(".syFormBox .agentEnquired .formHeading").addClass("active");
				$(".syFormBox .agentEnquired .syFormBody").addClass("active");
			}, 4000);
		}

		$(`#${formid}_alreadyLead`).removeClass("active");

		if ($(`#${formid}_leadForm`).length > 0 || $(".globalModal.bannersLead.active").length > 0) {
			$(".overLayBox,.globalOverflow").addClass("active"); $("body").addClass("scroll-lock");
			if ($(".globalModal.bannersLead.active").length > 0 && isMobileBrowser() == true) {
				$('.globalModal.bannersLead.active .bannersLeadBox .bannerLeft').remove();
			}
		}

		$('body').on('click', 'div.closeAgentModalPopup', () => {
			$('div.agentModalBox').removeClass('active');
			$('div.overLayBox,.globalOverflow').removeClass('active'); $('body').removeClass('active scroll-lock');
			$(`#${modalpopupid}`).html('');
			$(`#${modalpopupid}`).removeClass('active');
			$('.popupGallery .rightForm,.MapForm').removeClass('active');
		});

		if (isdsepage == true) {
			$(`#${modalpopupid}`).addClass("active");
			if (formid.indexOf("_dsepopup") == -1) {
				$(`#${formid}`).removeClass("active");
			}
			$(".gblPpup .gblOrflw, .ldBxClsBtn").off("click");
				$(".gblPpup .gblOrflw, .ldBxClsBtn").on("click", () => {
				$(".gblPpup,div.overLayBox,.globalOverflow").removeClass("active"); $("body").removeClass("active scroll-lock");
				$(`#${formid}`).removeClass("active");
			});
		} else {
			$(`#${formboxid}`).parent(".popupForm.active").removeClass('active');
		}
	}

	if (iscommonleadform == true) {
	} else {
		$(`#${formid}`)[0].reset();
		const city = $(`#${formid} input#dev_inputelement`).attr('placeholder');
		$('#ddlLocation').val(city);
	}

	$('#agentWhatsappChatBtn').on('click', () => {
		$(`#${modalpopupid}`).siblings('button.closeButton').trigger('click');
	});

	$(`#${otpboxformid}`)[0].reset();
	$(`#${changeNumberformid}`)[0].reset();
	$('.homePageLeadFormOverLay').removeClass("active");
	$('.gblPpup.pricehistoryUnlock,.globalModal.pricehistoryUnlock').removeClass('active');

	if (isfirepixel == true) {
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			event: 'otp_verified_dotcom'
		});

		$.getScript("/assets/lib/js/colombiapixel.js", () => {
			$("#dev_colombia_lead_noscript").html(globalfn.colombianoscript);
		});
	}
	if (isMobileBrowser()) {
		$('.position-sticky').removeClass('active');
	}

	if (isMobileBrowser() == false && $('.syFormBox .matching-property .bxslider').length > 0) {
		$('.syFormBox .matching-property .bxslider').bxSlider({
			mode: 'horizontal',
				moveSlides: 1,
				infiniteLoop: false,
				slideWidth:337,    
				minSlides:2,
				maxSlides:2,
				speed:500,
				hideControlOnEnd:true,
				pager:false,
				touchEnabled:false,
		});
	}

	if (pageCategory == 'propamcCommonServices') {
		if (typeof propamcCommonTicketResponse != 'undefined' && Object.keys(propamcCommonTicketResponse).length > 0 && propamcCommonTicketResponse.status == 1) {
			helperJS.alertBox('success', "Request Submitted Successfully!!!");
		} else {
			helperJS.alertBox('error', 'something went wrong');
			$('.globalModal').removeClass('active');
			$(`#${formid}_leadForm`).addClass('active');
			$('.globalOverflow').removeClass('active'); $('body').removeClass('active scroll-lock');
		}
	}

	if ($('.popupGallery.active').length && pageCategory != 'VideoDetail') {
		$('body').addClass('scroll-lock');
	}

	$('#loaderBox').hide();
};

const renderPriceHistoryData = (name, formFilled, pageType, owlCarousel) => {
	$('.dataIntelligenceLastTxns').empty();
	let propertyRatePageOwlCarousel = false;
	if (typeof currentButtonClickDI != 'undefined' && currentButtonClickDI) {
		name = currentButtonClickDI;
		propertyRatePageOwlCarousel = true;
	}
	if (transactionData[name] && transactionData[name].recordCount) {
		const transactionLastTxnsHtml = `<span>Showing ${transactionData[name].recordCount >= 12 ? "Last 12" : transactionData[name].recordCount} Transactions.</span>`;
		$('.dataIntelligenceLastTxns').html(transactionLastTxnsHtml);
	}
	let html = '';
	if (transactionData[name] && transactionData[name].records && transactionData[name].records.length > 0) {
		$('.mainDiv').empty();
		if (pageType && pageType === 'projectDetail') {
			html = '<div class="transactionTable scrollBarHide">';
			let tType = '';
			transactionData[name].records.forEach((_d, i) => {
				if (name == 'newProject') {
					_d.transactionType = 'sale';
					tType = 'New Sale';
				} else if (name == 'sale') {
					_d.transactionType = 'newproject';
					tType = 'Resale';
				} else if (name == 'ALL') {
					tType = 'Sale';
				} else if (name == 'lease') {
					tType = 'Lease';
				}
				let value;
				let rate_per_sft;
				if (!(_d.saleRentValue.toString().includes(' '))) {
					value = _d.transactionType.toLowerCase() == 'lease' ? globalfn.numberWithCommas(_d.saleRentValue) : (_d.saleRentValue.includes(',')) ? _d.saleRentValue : helperJS.changeNumberFormat(_d.saleRentValue);
				} else {
					value = _d.saleRentValue;
				}
				if (!(_d.ratePerSqft.toString().includes(','))) {
					rate_per_sft = globalfn.numberWithCommas(_d.ratePerSqft);
				} else {
					rate_per_sft = _d.ratePerSqft;
				}
				let ratePerSqFtThead = `Rate/Sq. Ft.`;
				let ratePerSqFt = `<td align="left" valign="middle" data-th="Rate/Sq. Ft."> ${rate_per_sft ? (rate_per_sft != 0 ? `${rate_per_sft}` : '-') : '-'} </td>`;
				if (_d.transactionType == "mortgage") {
					ratePerSqFtThead = `Lender Name`;
					ratePerSqFt = `<td align="left" valign="middle" data-th="Rate/Sq. Ft.">${_d.lenderName ? _d.lenderName : '-'} </td>`;
				}
				if (i == 0) {
					html += `
					<table border="1" cellspacing="0" cellpadding="5" bordercolor="#e6e6e6">
					<tbody>
					<tr>
					<td align="left" valign="middle"><strong>Date</strong></td>
					<td align="left" valign="middle"><strong>Floor/Unit</strong></td>
					<td align="left" valign="middle"><strong>Tower/Wing</strong></td>
					<td align="left" valign="middle"><strong>Area</strong></td>
					<td align="left" valign="middle"><strong>Value</strong></td>
					<td align="left" valign="middle"><strong>${ratePerSqFtThead}</strong></td>
					<td align="left" valign="middle"><strong>Transaction <br>Type</strong></td>
					</tr>`;
				}
				html += `
					<tr>
					<td align="left" valign="middle" data-th="Date">${_d.registrationDate}</td>
					<td align="left" valign="middle" data-th="Floor/Unit">${_d.floorNumber ? `Floor ${_d.floorNumber},` : ''}  ${_d.unitNumber ? `Unit ${_d.unitNumber}` : '-'}</td>
					<td align="left" valign="middle" data-th="Tower/Wing">${_d.towerName ? _d.towerName : (_d.wingNumber ? _d.wingNumber : '-')}</td>
					<td align="left" valign="middle" data-th="Area">${_d.area && _d.area != '0' ? `${_d.area} Sq. Ft.` : '-'}</td>
					<td align="left" valign="middle" data-th="Value">${value}</td>
					${ratePerSqFt}
					<td align="left" valign="middle" data-th="Transaction Type">${(tType ? (tType == 'sale' ? 'Sale' : (tType == 'lease' ? 'Lease' : (tType == 'mortgage' ? '-' : tType))) : '-')}</td>
					</tr>             
				`;
			});
			html += "</tbody></table></div>";
		} else {
			html = '<div class="govtPRTableBox">';
			let tType = '';
			transactionData[name].records.forEach((_d, i) => {
				if (name == 'newProject') {
					_d.transactionType = 'sale';
					tType = 'New Sale';
				} else if (name == 'sale') {
					_d.transactionType = 'newproject';
					tType = 'Resale';
				} else if (name == 'ALL') {
					tType = _d.tType;
				} else if (name == 'lease') {
					tType = 'Lease';
				}
				let value;
				let rate_per_sft;
				if (!(_d.saleRentValue.toString().includes(' '))) {
					value = _d.transactionType.toLowerCase() == 'lease' ? _d.saleRentValue : (_d.saleRentValue.includes(',')) ? _d.saleRentValue : _d.saleRentValue;
				} else {
					value = _d.saleRentValue;
				}
				if (!(_d.ratePerSqft.toString().includes(','))) {
					rate_per_sft = globalfn.numberWithCommas(_d.ratePerSqft);
				} else {
					rate_per_sft = _d.ratePerSqft;
				}
				let ratePerSqFtThead = `<th align="center" valign="middle">Rate/Sq. Ft.</th>`;
				let ratePerSqFt = `<td align="center" valign="middle"> ${rate_per_sft && rate_per_sft != '0' ? `${rate_per_sft}` : '-'} </td>`;
				if (_d.transactionType == "mortgage") {
					ratePerSqFtThead = `<th align="center" valign="middle">Lender Name</th>`;
					ratePerSqFt = `<td align="center" valign="middle">${_d.lenderName ? _d.lenderName : '-'} </td>`;
				}
				if (i == 0) {
					html += `
				<table class="govtPRTable ${_d.transactionType.toLowerCase()}Bg">
				<thead>
					<tr>
					<th align="left" valign="middle">Project Name</th>
					<th align="center" valign="middle">Date</th>
					<th align="center" valign="middle">Floor/Unit</th>
					<th align="center" valign="middle">Tower/Wing</th>
					<th align="center" valign="middle">Area</th>
					<th align="center" valign="middle">Value</th>
					${ratePerSqFtThead}
					<th align="center" valign="middle">Transaction Type</th>
					</tr>
				</thead><tbody>`;
				}
				html += `
					<tr>
					<td align="left" valign="middle">
						<div class="towerName"><span>${_d.propertyName}</span> </div>
						<div class="towerAddress">${_d.locality ? `${_d.locality} , ` : ''} ${_d.location}</div>
					</td>
					<td align="center" valign="middle">${_d.registrationDate}</td>
					<td align="center" valign="middle">${_d.floorNumber ? `Floor ${_d.floorNumber},` : ''}  ${_d.unitNumber ? `Unit ${_d.unitNumber}` : '-'}</td>
					<td align="center" valign="middle">${_d.towerName ? _d.towerName : (_d.wingNumber ? _d.wingNumber : '-')}</td>
					<td align="center" valign="middle">${_d.area ? `${_d.area} Sq. Ft.` : '-'}</td>
					<td align="center" valign="middle">${value}</td>
						${ratePerSqFt}
					<td align="center" valign="middle">${(tType ? (tType == 'sale' ? 'Sale' : (tType == 'lease' ? 'Lease' : (tType == 'mortgage' ? '-' : tType))) : '-')}</td>
					</tr>
				  
				`;
			});
			html += pageType != "" ? "</tbody></table></div>" : "";
		}
		if (html != '') {
			$('.mainDiv').html(html);
		}
	} else {
		html = `<div class="priceTime"><div class="priceHistory empty"><img width=${(isMobileBrowser()) ? '340' : '720'} height=${(isMobileBrowser()) ? '283' : '512'} src=${(helperJS) ? helperJS.imageCdnUrl('img.squareyards.com', 'img.squareyards.com', 'https://img.squareyards.com/assets/images/historyEmpty1.png', ((isMobileBrowser()) ? '340' : '720'), ((isMobileBrowser()) ? '283' : '512')) : 'https://img.squareyards.com/assets/images/historyEmpty1.png'} class="img-responsive"><h2>No Transaction History Found</h2></div></div>`;
		$('.mainDiv').html(html);
	}
};

const renderTransactionDataTable = (data, name) => {
	if (data && Object.keys(data).length > 0) {
		if (isMobileBrowser() == false) {
			$('tbody.dataTableBody').empty();
			$('div.registerUnlockDiv').hide();
			$('button.viewMoreTrData').hide();
			let html1 = ''; let html2 = ''; let html3 = ''; let
				html4 = '';
			const mlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			// i for table selection and j for row data for respective table
			for (let i = 0; i < 4; i++) {
				let dataArray = ''; let tableId = '';
				if (i == 0 && data && data.sale && data.sale.length > 0) {
					dataArray = data.sale;
					tableId = 'saleDataIntelligenceTable';
				}

				if (i == 1 && data && data.lease && data.lease.length > 0) {
					dataArray = data.lease;
					tableId = 'rentDataIntelligenceTable';
				}

				if (i == 2 && data && data.mortgage && data.mortgage.length > 0) {
					dataArray = data.mortgage;
					tableId = 'mortgageDataIntelligenceTable';
				}

				if (i == 3 && data && data.gv && data.gv.residential && data.gv.residential.length > 0) {
					dataArray = data.gv.residential;
					tableId = 'gvDataIntelligenceTable';
				}

				if (dataArray != '') {
					let html = '';
					dataArray.forEach((_d, j) => {
						html += '<tr>';
						if (i <= 2) {
							let value = 0;
							if (i == 1) {
								value = (_d.value == 0 || _d.value == '' || _d.value == undefined) ? 0 : globalfn.numberWithCommas(_d.value);
							} else {
								value = (_d.value == 0 || _d.value == '' || _d.value == undefined) ? 0 : helperJS.changeNumberFormat(_d.value);
							}
							const rate_per_sft = (_d.value == 0 || _d.value == '' || _d.value == undefined) ? 0 : globalfn.numberWithCommas(_d.rate_per_sft);
							html += `<td><span>${mlist[_d.month - 1]},${_d.year}</span></td>
								<td><span>Floor ${_d.floor}, Unit ${_d.unit_no}</span></td>
								<td><span>${_d.area} Sq.Ft.</span></td>`;
							html += `<td><span ${value == 0 ? 'class="transactionBlur"' : ''}>${value}</span></td>`;
							if (i == 2) {
								html += `<td><span ${_d.first_party == 0 ? 'class="transactionBlur"' : ''}>${_d.first_party == '' ? '-' : _d.first_party}</span></td>`;
							} else {
								html += `<td><span ${rate_per_sft == 0 ? 'class="transactionBlur"' : ''}>${rate_per_sft}</span></td>`;
							}
						} else {
							const value = (_d.value == 0 || _d.value == '' || _d.value == undefined) ? 0 : globalfn.numberWithCommas(_d.value);
							html += `<td><span>${_d.year}</span></td>`;
							html += `<td><span ${value == 0 ? 'class="transactionBlur"' : ''}>${value}</span></td>`;
						}
						html += '</tr>';
					});

					if (i == 0) { html1 = html; } else if (i == 1) { html2 = html; } else if (i == 2) { html3 = html; } else { html4 = html; }
				}
			}

			$.getScript('/assets/lib/js/jquery.dataTables.min.js', () => {
				$('.dataIntelligenceTable').DataTable().destroy();
				if (html1 != '') {
					$(`#saleDataIntelligenceTable tbody.dataTableBody`).html(html1);
				}
				if (html2 != '') {
					$(`#rentDataIntelligenceTable tbody.dataTableBody`).html(html2);
				}
				if (html3 != '') {
					$(`#mortgageDataIntelligenceTable tbody.dataTableBody`).html(html3);
				}
				if (html4 != '') {
					$(`#gvDataIntelligenceTable tbody.dataTableBody`).html(html4);
				}
				$('.dataIntelligenceTable').DataTable({
					paging: false,
					searching: false,
					info: false,
					autoWidth: false
				});
			});
		} else {
			const mlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			// i for div selection and j for row data for respective div
			for (let i = 0; i < 4; i++) {
				let dataArray = ''; let divId = ''; let
					transactionType = '';
				if (i == 0 && data && data.sale && data.sale.length > 0) {
					dataArray = data.sale;
					transactionType = 'Registered Sale';
					divId = 'saleDataIntelligenceDiv';
				}

				if (i == 1 && data && data.lease && data.lease.length > 0) {
					dataArray = data.lease;
					transactionType = 'Registered Lease';
					divId = 'rentDataIntelligenceDiv';
				}

				if (i == 2 && data && data.mortgage && data.mortgage.length > 0) {
					dataArray = data.mortgage;
					transactionType = 'Registered Mortgage';
					divId = 'mortgageDataIntelligenceDiv';
				}

				if (i == 3 && data && data.gv && data.gv.residential && data.gv.residential.length > 0) {
					dataArray = data.gv.residential;
					transactionType = 'Government Value';
					divId = 'gvDataIntelligenceDiv';
				}

				if (dataArray != '') {
					let html = '';
					dataArray.forEach((data, j) => {
						if (j < 5) {
							html += '<div class="propertyDetailCard">';
						} else {
							html += '<div class="propertyDetailCard trHide">';
						}

						html += '<div class="tableDetailBox"><div class="table50Box">';
						if (i < 3) {
							html += `<strong>${mlist[data.month - 1]}, ${data.year}</strong>`;
							html += `<span>Floor ${data.floor}, Unit ${data.unit_no}</span>`;
						} else {
							html += `<strong>${data.year}</strong>`;
						}
						html +=	`</div><p>${transactionType}</p></div><div class="tableDetailBox"><div class="table75Box">`;
						if (i < 3) {
							let value = 0;
							if (i == 1) {
								value = (data.value == 0 || data.value == '' || data.value == undefined) ? 0 : globalfn.numberWithCommas(data.value);
							} else {
								value = (data.value == 0 || data.value == '' || data.value == undefined) ? 0 : helperJS.changeNumberFormat(data.value);
							}
							html += `<div class="table50Box"><span>Area(Sqft)</span> <strong>${data.area}</strong></div><div class="table50Box"><span${value == 0 ? 'class="transactionBlur"' : ''}>Value</span> <strong>${value}</strong> </div>`;
						}
						html += '</div><div class="table25Box">';
						if (i < 2) {
							const rate_per_sft = (data.value == 0 || data.value == '' || data.value == undefined) ? 0 : globalfn.numberWithCommas(data.rate_per_sft);
							html += `<span${rate_per_sft == 0 ? 'class="transactionBlur"' : ''}>Rate/Sqft</span> <strong>${rate_per_sft}</strong>`;
						} else if (i < 3) {
							html += `<span${data.first_party == 0 ? 'class="transactionBlur"' : ''}>Lender</span> <strong>${data.first_party == '' ? '-' : data.first_party}</strong>`;
						} else {
							const value = (data.value == 0 || data.value == '' || data.value == undefined) ? 0 : globalfn.numberWithCommas(data.value);
							html += `<span${value == 0 ? 'class="transactionBlur"' : ''}>Value/Sqft</span> <strong>${value}</strong>`;
						}
						html += '</div></div></div>';
					});
					html += '<button class="btn moreDataBtn viewMoreTrData"><span>Click to view 5 more</span></button>';
					$(`#${divId}`).empty().html(html);
				}
			}
		}
	}
};

const resetCommonLeadForm = (formid, otpboxformid, changeNumberformid, formtype, closeclick) => {
	$(`#${formid}_dev_ModalBox_limit`).removeClass("active");

	$(`#${formid}_formbody`).show();

	const filledLeadBoxElem = $(`#${formid}_alreadyLead`);
	const hasuserinfo = $(`#${formid}_alreadyLead`).find(".generateInfoBox").find(".generateNumberBox").length;
	const info = $(`#${formid}_info`).length ? JSON.parse($(`#${formid}_info`).val()) : {};

	$(`#${formid}_alreadyLead`).removeClass("active");
	$(`#${formid}_leadForm`).removeClass("active");

	$(".popupForm,#pdCalculate").removeClass("active");

	if ($(".popupGallery.active").length > 0 || $(".popupBox.factsheet-popup.active").length > 0 || $(".globalModal.listingBanner.active").length > 0 || $(".globalModal.listingdsePopup.active").length > 0) {
        	if (typeof closeclick != 'undefined' && closeclick == true) {
        		$(".overLayBox,.globalOverflow").removeClass("active"); $("body").removeClass("active scroll-lock");
        		$(".popupBox.factsheet-popup.active,.popupGallery .rightForm.active,.MapForm.active").removeClass("active");
        	}
	} else {
        	$(".overLayBox,.globalOverflow").removeClass("active"); $("body").removeClass("active scroll-lock");
	}

	if (typeof closeclick != 'undefined' && closeclick == true) {
        	$(".overLayBox,.globalOverflow").removeClass("active"); $("body").removeClass("active scroll-lock");
        	$(".galleryLeadBox").removeClass("active");
        	$(`#${formid}_dev_ModalBox`).removeClass("active");
        	$(`#${formid}_dev_ModalBox_limit`).removeClass("active");
	}

	const _userData = globalfn.getUserDetails();

  		if (hasuserinfo > 0 && (typeof info.isBranded != 'undefined' && info.isBranded == 1 && $(`#${formid} input[name='propertyType']`).length > 0 && $(`#${formid} input[name='propertyType']`).val().toLowerCase() == 'pg') == false && typeof _userData != 'undefined' && _userData && _userData.countryCode && _userData.mobile) {
  			$(`#${formid}`).removeClass("active");
  			$(filledLeadBoxElem).addClass("active");

  			if (formtype == "LISTING") {
			$(`#${formid}_userbox`).show();
		}
  		} else {
  			$(`#${formid}`).addClass("active");
  			$(filledLeadBoxElem).removeClass("active");

		$(`#${formid}_userbox`).show();
  		}

	$(`#${otpboxformid}`).removeClass("active");
	$(`#${changeNumberformid}`).removeClass("active");

	$(`#${formid}_heading strong`).text($(`#${formid}_oldformheading`).text());
	$(`#${formid}_heading,#dev_home_propertytabbox`).show();
	$(`#${formid} .choiceList li`).removeClass("selected");
	$(`#${formid} .choiceList li:first`).addClass("selected");
	$(`#${formid}`).find("input[name='interestedIn']").val("");
};

const showExhaustLimitPopUp = (formid, otpboxformid, changeNumberformid, formtype) => {
	const limithtml = `${'<div class="limitOverBox"><div class="limitOverImg">'
	+ '<img src="'}${baseUrl}assets/images/limit-warning.png" alt=""></div>`
	+ `<div class="limitHeading">Your Today’s Limit Exhausted!</div>`
	+ `<div class="limitDescription">Uh Oh! Too many queries for a day.<br>`
	+ `Please Check again tomorrow. </div><div class="formBtnBox"><button class="btn btn-primary">Okay</button></div>`
	+ `</div>`;

  	$(`#${formid}_dev_ModalBox_limit`).html(limithtml);
  	$(`#${formid}_dev_ModalBox_limit`).addClass("active");

  	$(".globalModal").not('.listingBanner').not('.listingdsePopup').removeClass("active");
  	$(`#${formid}_leadForm`).addClass("active");

  	$(`#${formid}_dev_ModalBox_limit`).addClass("active");
  	$(`#${formid}_formbody`).hide();
  	$(`#${formid}_heading,#dev_home_propertytabbox`).hide();

  	if ($(`#${formid}_alreadyLead`).length > 0) {
  		$(`#${formid}_alreadyLead`).removeClass("active");
  	}

  	if ($(`#${formid}_leadForm`).hasClass("active") == true) {
  		$(".globalOverflow").addClass("active");
  	}

  	$(`#${formid}_dev_ModalBox_limit .btn.btn-primary`).off("click");
  	$(`#${formid}_dev_ModalBox_limit .btn.btn-primary`).on("click", () => {
  		resetCommonLeadForm(formid, otpboxformid, changeNumberformid, formtype);
  	});
};

const fillLeadForm = (formid, formtype = '') => {
	const _userData = globalfn.getUserDetails();
	if (_userData != undefined) {
		let isEmailLoggedIn = false;
        if(_userData.email && !_userData.mobile && !_userData.countryCode){
          isEmailLoggedIn = true;
        }

		$(`#${formid} #name`).val(_userData.userName);
		$(`#${formid} #name`).attr("value", _userData.userName);
		$(`#${formid} #email`).val(_userData.email);
		$(`#${formid} #email`).attr("value", _userData.email);

		if(isEmailLoggedIn){
			$(`#${formid} #email`).attr("disabled","disabled");
		}else{
			$(`#${formid} #email`).removeAttr("disabled");
		}

		// default city set in case of all india page and user already logged in
		if ($(`#${formid} select[name='location']`).val() == "" && formtype != '') {
			if (formtype == 'PROJECT') {
				$(`#${formid} select[name='location']`).val($(`#${formid} input#prjcity`).val());
			}

			if (formtype == 'LISTING') {
				$(`#${formid} select[name='location']`).val($(`#${formid} input#formLocation`).val());
			}
		}

		if (typeof _userData != 'undefined' && _userData.countryCode) {
			$(`#${formid} #ddlCountryCode`).val(_userData.countryCode);
		}

		$(`#${formid} #mobile`).val(_userData.mobile);
		$(`#${formid} #mobile`).attr("value", _userData.mobile);
	}
};

const globalsendOtp = (formboxid, formid, changenoid, otpboxformid, modalpopupid, pageCategory, isdsepage, iscommonleadform, isskipotp, building_id, formtype, listingtype, unitSizes = [], unitPrices = [], unitCategories = [], loadviewinpopup) => {
	const countrycode = $(`#${formid}`).find("select[name='countryCode']").val();
	const mobile = $(`#${formid} input[name='mobile']`).val();

	if (typeof globalfn.validateMobile != 'undefined') {
		const validationForMobile = globalfn.validateMobile(formid);
		if (validationForMobile == false) return false;
	}

	if (isskipotp == true) { // logged in then autofill
		fillLeadForm(formid, formtype);
	}

	if (typeof iscommonleadform != 'undefined' && iscommonleadform == true && isskipotp == false) {
		if (formtype && formtype == 'DIDEMO' && globalfn.getUserDetails() != undefined) {
			$('#loaderBox').show();
		}
	} else {
		$('#loaderBox').show();
	}
	$(".homePageLeadFormOverLay .homeFormBox h3").text('Verify your Number');
	let data = [];
	$(`#${otpboxformid} .otpError`).html('');
	const buildingId = $("input[name='buildingId']").val();
	$(`#${formid} .sendotpError`).html('');
	data = $(`#${formid}`).serializeArray();
	if (typeof data.countryCode == 'undefined') data.countryCode = countrycode;
	if (typeof data.mobile == 'undefined') data.mobile = mobile;

	if (buildingId != undefined) {
		data.push({ name: 'builderId', value: buildingId });
	}

	const name = $(`#${formid} input[name='name']`).val();
	const email = $(`#${formid} input[name='email']`).val();
	let location = $(`#${formid} select[name='location']`).val();
	let propertyId = $(`#${formid}`).find('input[name="DotcomProjectId"]').val();
	const unitId = $(`#${formid}`).find("input[name='unitId']").val();

	const priceHistorPage = $(`#${formboxid} input[name='pricehistoryType']`).val();
	const listingUrlPropAmc = $(`#${formboxid} input[name='listingUrl']`).val();
	const type = $(`#${formboxid} input[name='type']`).val();
	const sharerId = $(`#${formid} input[name='SharerId']`).val();
	const sharerType = $(`#${formid} input[name='SharerType']`).val();
	let whatsappOptn = !!$(`#${otpboxformid} input[name='whatsapp_check']:checked`).length;
	if ($(`#${formid} #formaction`).val() && $(`#${formid} #formaction`).val().toLowerCase() == 'whatsapp') whatsappOptn = true;
	const isWhatsApp = Boolean($(`#${formid} #formaction`).val() && $(`#${formid} #formaction`).val().toLowerCase() == 'whatsapp');

	let propertyTitle = "";
	let user = 0;
	let userType = "";
	let DotcomProjectId = "";
	let userName = "";
	let subLocalityName = "";
	let area = "";
	let unitType = "";
	let propertyType = "";
	let projectName = "";
	let prjsublocation = "";
	let prjcity = "";
	let prjdeveloper = "";
	let prjsize = "";
	let prjprice = "";
	let prjarea = "";
	let minarea = "";
	let maxarea = "";
	let lowcost = "";
	let highcost = "";
	let price = "";
	let cityId = "";
	let subLocationId = "";

	if (formtype == "LISTING") {
		propertyTitle = $(`#${formid} input#formPropertyTitle`).val();
		location = $(`#${formid} input#formLocation`).val();
		propertyId = $(`#${formid} input#formPropertyId`).val();
		user = $(`#${formid} input#formUserId`).val();
		userType = $(`#${formid} input#formUserTypeId`).val();
		userName = $(`#${formid} input#formUserName`).val();
		subLocalityName = $(`#${formid} input#formsubLocalityName`).val();
		area = $(`#${formid} input#formarea`).val();
		unitType = $(`#${formid} input#formunitType`).val();
		propertyType = $(`#${formid} input#formpropertyType`).val();
		projectName = $(`#${formid} input#formprojectName`).val();
		prjprice = $(`#${formid} input#formtotalPrice`).val();
		price = $(`#${formid} input#formprice`).val();
		cityId = $(`#${formid} input#formCityId`).val();
		subLocationId = $(`#${formid} input#formSublocationId`).val();
	}

	if (formtype == "PROJECT") {
		DotcomProjectId = $(`#${formid} input#DotcomProjectId`).val();
		projectName = $(`#${formid} input#projectName`).val();
		prjsublocation = $(`#${formid} input#prjsublocation`).val();
		prjcity = $(`#${formid} input#prjcity`).val();
		location = $(`#${formid} input#prjcity`).val();
		prjdeveloper = $(`#${formid} input#prjdeveloper`).val();
		prjsize = $(`#${formid} input#prjsize`).val();
		prjprice = $(`#${formid} input#prjprice`).val();
		prjarea = $(`#${formid} input#prjarea`).val();
		minarea = $(`#${formid} input#prjminarea`).val();
		maxarea = $(`#${formid} input#prjmaxarea`).val();
		lowcost = $(`#${formid} input#prjlowcost`).val();
		highcost = $(`#${formid} input#prjhighcost`).val();
		cityId = $(`#${formid} input#prjcityId`).val();
		subLocationId = $(`#${formid} input#prjsubLocationId`).val();
	}

	let formname = "";
	if (pageCategory == 'LISTINGRENTALDSE' || pageCategory == 'LISTINGRESALEDSE' || pageCategory == 'DSE' || pageCategory == 'New_Project_Detail' || pageCategory == 'RECOMMENDATIONNEWPROJECTLISTING' || pageCategory == 'RECOMMENDATIONRESALELISTING' || pageCategory == 'RECOMMENDATIONRENTALLISTING' || pageCategory == 'LISTING' || pageCategory == 'LISTINGRENTALDETAIL' || pageCategory == 'LISTINGRESALEDETAIL' || pageCategory == 'PROJECT' || pageCategory == 'AGENT' || pageCategory == 'Upcoming_Projects') {
		formname = $(`#${formid} input#dev_formname`).val();
	}

	const projectIds = [];
	var compareMode = '';
	var rsListingIds = '';
	var selectedUnitIds = '';
	if (pageCategory == "COMPARE" && isskipotp == true) {
		if ($('.grid.available').length) {
			$('.grid.available').each(function () {
				projectIds.push($(this).data('id'));
			});
		} else {
			($('#hd_compareProjectIds').val() || '').split(',').filter(Boolean).forEach(function (id) {
				projectIds.push(id);
			});
			compareMode = $('#hd_compareMode').val() || '';
			rsListingIds = $('#hd_compareRsListingIds').val() || '';
			selectedUnitIds = $('#hd_compareSelectedUnitIds').val() || '';
		}
	}

	const formdatajson = globalfn.serializeToJson($(`#${formid}`).serializeArray());
	if (typeof formdatajson.countryCode == 'undefined') formdatajson.countryCode = countrycode;
	if (typeof formdatajson.mobile == 'undefined') formdatajson.mobile = mobile;
	const formdata = JSON.stringify(formdatajson);

	let campIDAzuro = 0;
	if (typeof window.campidforazuro != 'undefined' && window.campidforazuro != '' && window.campidforazuro == 'lease') {
		campIDAzuro = 50007;
	}
	let formInfoData = {};
	let videoId = 0;
	if ($(`#${formid}_info`).length && $(`#${formid}_info`).val()) {
		formInfoData = JSON.parse($(`#${formid}_info`).val());
		if (formInfoData.videoId) videoId = formInfoData.videoId;
	}

	const filteredData = { videoId,
		projectIds: projectIds.toString(),
		compareMode,
		rsListingIds,
		selectedUnitIds,
		formtype,
		otp: "",
		whatsappOptn,
          	DotcomProjectId,
		formdata,
		buildingId: building_id,
          	type,
		priceHistorPage,
		listingUrlPropAmc,
          	campIDAzuro,
		isskipotp,
		formname,
		formboxid,
		countryCode: countrycode,
		mobile,
		unitSizes,
		unitPrices,
		unitCategories };
	data.filter((v) => {
		filteredData[v.name] = v.value;
	});
	if (filteredData.countryCode == null && countrycode != "") {
		filteredData.countryCode = countrycode;
	}

	// SY Pulse identity plumbing — the server lead hooks read the cookie first, these are a fallback
	const _syCtx = (window.syPulse && window.syPulse.context) ? window.syPulse.context() : {};
	filteredData.sy_anon_id = _syCtx.anon_id || '';
	filteredData.sy_session_id = _syCtx.session_id || '';
	filteredData.sy_page_group = _syCtx.page_group || '';
	/* WHERE THE VISITOR CAME FROM, carried on the lead body rather than joined from the session.
	   The lead events are emitted by the SERVER, and a lead POST's own Referer is the page the form
	   sits on — never the site that sent the visitor. The rollup can fall back to the session, but
	   only when there IS one, and an assistant-sent link is precisely the case with no identity at
	   all. This is what tells a ChatGPT lead from a Claude one. */
	filteredData.sy_traffic_source = _syCtx.traffic_source || '';
	filteredData.sy_traffic_detail = _syCtx.traffic_detail || '';
	filteredData.sy_form_placement = getSyFormPlacement(formid, pageCategory, formboxid);
	/* EVERY lead that reaches this function is a FORM lead, so its channel is `call`.
	   A WhatsApp lead is a visitor who clicked the WhatsApp CTA and went straight to WhatsApp —
	   `.whatsapp-lead` in listingV3.js, which opens api.whatsapp.com and emits `whatsapp_redirect`.
	   It never calls this flow and never produces a lead_verified at all. Someone who OPENED the
	   form and filled it in gave us their number and asked to be contacted, whichever CTA brought
	   them there and whatever the form's `formaction` says.
	   This used to be inferred from `whatsappOptn` — the "Enable updates through WhatsApp" consent
	   checkbox, which ships `checked` and was the only signal reaching the server. Live data read
	   6,511 WhatsApp against 82 call: a checkbox default, not a channel split. */
	filteredData.sy_lead_channel = 'call';
	const _syLeadProps = {
		form_placement: filteredData.sy_form_placement || formname || '',
		form_box_id: formboxid || '',
		form_type: formtype || '',
		lead_type: 'call'   // a form fill; see sy_lead_channel above
	};
	if (propertyId) _syLeadProps.property_id = propertyId;

	helperJS.autoReadSMS((code) => {
		$(`#${formboxid}`).find("input[name=otp_contactform]").val(code).trigger('keyup');
	});
	//   console.log(filteredData);
	$.ajax({
		type: "POST",
		url: '/lead/globalsendotp-v2',
		// url: '/'+'resale'+'/send-broker-detail-otp-v2',
		data: helperJS.jsonEncrypt(filteredData),
		success(data) {
			$('#loaderBox').hide();
			if (data.status) {
				// dataLayerOnly GA4 mirror — the SERVER emits the authoritative lead_otp_requested
				if (window.syPulse) {
					_syLeadProps.submit_mode = data.isskipotp ? 'one_tap' : 'full_form';
					window.syPulse.track('lead_otp_requested', _syLeadProps, { dataLayerOnly: true });
				}
				let otp = "";
				if (data.otp) {
					otp = data.otp.toString();
				}
				let dLayer_pagetype = '';
				if (typeof (dataLayer) != "undefined") {
					for (let i = 0; i < dataLayer.length; i++) {
						if (dataLayer[i].PageType) {
							dLayer_pagetype = dataLayer[i].PageType;
							break;
						}
					}
				}
				let eventName = {};
				if (dLayer_pagetype == "Transaction") {
					const listingUrl = $("#listingUrl").val();
					const projectlocation = $(`#${formid}`).find('input[name="projectlocation"]').val();
					const projectName = $(`#${formid}`).find('input[name="projectName"]').val();
					const projectcity = $(`#${formid}`).find('input[name="projectcity"]').val();
					const pCityId = $(`#${formid}`).find('input[name="cityId"]').val();
					const psublocationId = $(`#${formid}`).find('input[name="sublocationId"]').val();
					eventName = {
						listingUrl: baseUrl + listingUrl,
						source: propertyId,
						projectLocation: projectlocation,
						projectName,
						enquiryType: '',
						type: "",
						projectCity: projectcity,
						name,
						emailId: email,
						mobile: `${countrycode}${data.encr}`,
						city: location,
						status: 'OTP unverified',
						googleId: (helperJS.getCookie('_ga')) || '',
						cityId: pCityId,
						subLocationId: psublocationId,
						url: window.location.href
					  };
				} else if (formtype == "LISTING") {
					eventName = {
				          name,
				          emailId: email,
				          mobile: `${countrycode}${data.encr}`,
						  cityId,
						  subLocationId: [`${subLocationId}`],
						  type: "",
				          propertyId,
				          agentId: user,
						  url: window.location.href,
				          agentName: userName,
				          pageType: dLayer_pagetype,
				          status: 'OTP unverified',
						  googleId: (helperJS.getCookie('_ga')) || ''
				        };
				} else if (formtype == "PROJECT") {
					eventName = {
						name,
						emailId: email,
						mobile: `${countrycode}${data.encr}`,
						cityId,
						  	subLocationId: [`${subLocationId}`],
						type: 'New Projects',
						projectId: DotcomProjectId,
						projectName,
						pageType: dLayer_pagetype,
						status: 'OTP unverified',
						googleId: (helperJS.getCookie('_ga')) || '',
						url: window.location.href
					};
				} else {
					eventName = {
						name,
						emailId: email,
						mobile: `${countrycode}${data.encr}`,
						city: location,
						type: "",
						projectId: propertyId,
						url: window.location.href,
						unitId,
						pageType: dLayer_pagetype,
						status: 'OTP unverified',
						googleId: (helperJS.getCookie('_ga')) || ''
					};
				}
				if (typeof dLayer_pagetype != 'undefined' && dLayer_pagetype != '') {
					if (dLayer_pagetype == "LISTINGRESALE") {
						eventName.type = 'Resale';
					} else if (dLayer_pagetype == "LISTINGRENTAL") {
						eventName.type = 'Rental';
					} else if (dLayer_pagetype == "AGENT_DETAIL") {
						eventName.type = 'Agents';
					} else if (dLayer_pagetype == "AGENT_LISTING") {
						eventName.type = 'Agents';
					} else if (dLayer_pagetype == "LISTINGRESALEDETAIL") {
						eventName.type = 'Resale';
					} else if (dLayer_pagetype == "LISTINGRENTALDETAIL") {
						eventName.type = 'Rental';
					} else if (dLayer_pagetype == 'AGENT_DSE') {
						eventName.type = 'Agents';
					} else if (dLayer_pagetype == 'SALE_DSE') {
						eventName.type = 'Resale';
					} else if (dLayer_pagetype == 'RENT_DSE') {
						eventName.type = 'Rental';
					} else if (dLayer_pagetype == 'PROPAMC') {
						eventName.type = 'DIUnlock';
					} else if (dLayer_pagetype == 'PROPAMCSUBSCRIBE') {
						eventName.type = 'DISubscribe ';
					} else if (dLayer_pagetype == 'RECOMMENDATIONRESALELISTING' && pageCategory == 'RECOMMENDATIONRESALELISTING') {
						eventName.type = 'Resale';
					} else if (dLayer_pagetype == 'RECOMMENDATIONRENTALLISTING' && pageCategory == 'RECOMMENDATIONRENTALLISTING') {
						eventName.type = 'Rental';
					} else {
						eventName.type = 'New Projects';
					}
				}
				if (eventName.name && eventName.mobile && typeof _paq != 'undefined') {
					if (dLayer_pagetype == "Transaction") {
						_paq.push(['trackEvent', 'intelligence', 'DIenquiry', JSON.stringify(eventName)]);
					} else {
						_paq.push(['trackEvent', 'product', 'enquired', JSON.stringify(eventName)]);
						if (pageCategory == 'RECOMMENDATIONRESALELISTING' || pageCategory == 'RECOMMENDATIONRENTALLISTING' || pageCategory == 'RECOMMENDATIONNEWPROJECTLISTING') {
							const eventCategory = ["Resale", "Rental"].includes(eventName.type) ? `recommendation_${eventName.type.toLowerCase()}` : "recommendation_newProject";
							const eventAction = isWhatsApp ? "whatsapp_form_filled" : "get_a_callback_form_filled";
							eventName.pageUrl = window.location.href;
							eventName.DeviceType = /android|iphone|ipad|ipod|blackberry|opera mini|iemobile|mobile/.test(navigator.userAgent.toLowerCase()) ? "Mobile" : "Desktop";
							_paq.push(['trackEvent', eventCategory, eventAction, JSON.stringify(eventName)]);
						}
					}
					// New project After otp sent
				}
              	if (data.isskipotp == true && typeof data.skipotpresdata != 'undefined') {
              		globalconfirmotpcallback(otp, formboxid, formid, changenoid, otpboxformid, modalpopupid, pageCategory, isdsepage, building_id, iscommonleadform, formtype, listingtype, data.skipotpresdata, countrycode, unitSizes, unitPrices, unitCategories, loadviewinpopup, 'one_tap');
              		return false;
              	}
				let otpBox;
				$(`#${formboxid}`).removeClass("changenumber");
				$(`#${otpboxformid} #otpMobile_contactform`).html(`+${filteredData.countryCode}-${filteredData.mobile}`);
				if (filteredData.email && filteredData.email != '' && filteredData.countryCode && filteredData.countryCode != '91') {
					$(`#${otpboxformid} #otpEmail_contactform`).html(`<span>and </span>${filteredData.email}`);
				}
				$(`#${formboxid}`).removeClass('active').addClass('active');
				//  $("#" + formid).css("display","none");

				if (isdsepage == true) {
                 	$(`#${formid}`).addClass("active");
                 	$(`#${otpboxformid}`).addClass("active");
                 	$(`#${changenoid}`).removeClass("active");
                 	$(`#${modalpopupid}`).removeClass("active");
				}

				if (typeof iscommonleadform != 'undefined' && iscommonleadform == true) {
                 	$(`#${formid}`).removeClass("active");
                 	$(`#${formid}_alreadyLead`).removeClass("active");
                 	$(`#${formid}_userbox`).show();
                 	$(`#${formid}_heading,#dev_home_propertytabbox`).show();

                 	let headingtext = "Verify your Number";
                 	let iswhatsappclick = "0";
	                if ($(`#${formid} input[name='iswhatsappclick']`).length > 0) {
	                	iswhatsappclick = $(`#${formid} input[name='iswhatsappclick']`).attr("value");
	                	if (iswhatsappclick == "1") {
	                		$(`#${formid}_heading em`).removeClass("call");
	                		$(`#${formid}_heading em`).addClass("whatsapp");
	                	} else {
	                		$(`#${formid}_heading em`).removeClass("whatsapp");
	                		$(`#${formid}_heading em`).addClass("call");
	                	}
	                	headingtext = $(`#${formid}_oldformheading`).text();
	                }

                 	$(`#${formid}_heading strong`).text(headingtext);

                 	$(`#${otpboxformid}`).addClass("active");
                 	$(`#${changenoid}`).removeClass("active");
					if (formtype == 'PROJECT') {
						$('.whyInvestThroughSquareYards,.syWhyInvest').hide();
					}
				}

				globalfn.global_run_clock(otpboxformid, 1);
				$(`#${otpboxformid} div.resendOtpBox span.resendOtpTimer`).show();
				$(`#${otpboxformid} div.resendOtpBox button`).prop('disabled', true).text('Resend OTP in');
				setTimeout(() => {
					$(`#${otpboxformid} div.resendOtpBox span.resendOtpTimer`).hide();
					$(`#${otpboxformid} div.resendOtpBox button`).prop('disabled', false).text('Resend OTP');
				}, (1 * 60 * 1000));
				otpBox = $(`#${otpboxformid}`);
				  building_id = data.builderId;
				if (data.otp) {
					const otp = data.otp.toString();
					if (otp.length == 4) {
						otpBox.find("input[name=otp_contactform]").val(otp).trigger('keyup');
					}
				} else {
                  	 otpBox.find("input[name=otp_contactform]").val('');
				}

				if (data.message == "uae_lead") {
                  	// afterVerification(filteredData.countryCode,filteredData.mobile,"detail",data.data.propertyLink,data)
				}

				  setTimeout(() => {
					$(`#${otpboxformid}`).find("#otpInput").focus();
				  });
			} else {
              	// console.log(data);
              	$(`#${formid} input[name='iswhatsappclick']`).attr("value", "0");
              	if (iscommonleadform == true && data.message.toLowerCase().indexOf("exhausted your attempts") != -1) {
              		showExhaustLimitPopUp(formid, otpboxformid, changenoid, formtype);
              	} else {
					helperJS.alertBox('error', data.message);
					// $(".globalModal,.globalOverflow").removeClass("active"); $("body").removeClass("active scroll-lock");
					$(`#${formid}_leadForm`).addClass("active");
				}
			}

			if (typeof iscommonleadform != 'undefined' && iscommonleadform == true) {
			  } else {
				$('#loaderBox').hide();
			  }
		}
	});
};

const homePageContactFormBtnClickV1 = function (tabval, pageCategory = "Home_Common_Lead_Form") {
	let dLayer_pagetype = '';
	if (typeof (dataLayer) != "undefined") {
		for (let i = 0; i < dataLayer.length; i++) {
			if (dataLayer[i].PageType) {
				dLayer_pagetype = dataLayer[i].PageType;
				break;
			}
		}
	}
	$('#loaderBox').show();
	const projectName = "";
	const DotcomProjectId = 0;
	const formboxid = "dev_leadpopup_form";
	// let baseurl = $(this).attr("baseurl");
	const clickclass = "";
	const verifyotp = "";
	const location = "";
	const lowCostText = "";
	const highCostText = "";

	const info = { name: projectName, location, lowCostText, highCostText, isDIPriceAvailable: 0, perSqFt: '' };

	const formaction = 'call';
	let formtype = 'PROJECT';
	const propertytabdata = [{ name: "Buy", tabval: "newproject", icon: "hti-icon1" }, { name: "Rent", tabval: "rental", icon: "hti-icon2" }, { name: "Home Loan", tabval: "homeloan", icon: "hti-icon4" }, { name: "Home Interior", tabval: "homeinterior", icon: "hti-icon5" }];
	const selectedtabdata_arr = propertytabdata.filter((e) => e.tabval == tabval);
	const othertabdata_arr = propertytabdata.filter((e) => e.tabval != tabval);

	let domesticCampId = 277;
	let internationalCampId = 600;

	if (tabval == "rental") {
	  domesticCampId = 6532;
	  internationalCampId = 6532;
	}

	if (tabval == "homeloan" || tabval == "homeinterior") {
	  formtype = tabval;
	}

	const reqdata = { projectName,
		DotcomProjectId,
		pageCategory,
		formboxid,
		baseurl: baseUrl,
		clickclass,
		verifyotp,
		leadviewinpopup: true,
		formid: 'homecommonlead_form',
		changenumberformid: 'NumberChange_homecommonlead_form',
		otpformid: 'BoxOtp_homecommonlead_form',
		formtype,
		info,
		formaction,
		selectedtabdata_arr,
		othertabdata_arr,
		domesticCampId,
		internationalCampId 
	};

	$.ajax({
		async: true,
		dataType: "html",
		contentType: "application/json",
		data: JSON.stringify(reqdata),
		success(data, textStatus) {
			$(`#${formboxid}`).html(data);
			initializeCommonLeadForm(formboxid, pageCategory, 'homecommonlead_form', 'NumberChange_homecommonlead_form', 'BoxOtp_homecommonlead_form', formtype, '');
			helperJS.initializeLazyLoad();
			openCommonLeadFormInPopUp("homecommonlead_form");
			if (pageCategory == 'bottom_nav_common_form') {
				if (isIpadBrowser()) {
					$('.mobileOurServices').removeClass('active').addClass('partialActive');
					$('#mobileOurServicesLi').removeClass('active');
				}
			}
			$('#loaderBox').hide();
		},
		error(error) {
			console.log(error);
			$('#loaderBox').hide();
		},
		type: "POST",
		url: "/getcommonleadform"
	});
};

const initAppLinkSender = function() {
    $(document).on('click', '#dekstopAppDownloadForm .sendAppLinkBtn', function (e) {
        e.preventDefault();
        const formdata = globalfn.serializeToJson($("#dekstopAppDownloadForm").serializeArray());
        if (!(formdata.mobileNumber 
              && formdata.mobileNumber.length == 10 
              && validateMobileByCountryCode(`+${formdata.countryCode}`, formdata.mobileNumber))) {
            helperJS.alertBox('error', 'Please Enter Valid Mobile Number.');
            return false;
        }
        formdata.pageUrl = window.location.href;
		formdata.countryCode = '91';
		let dLayer_pagetype = '';
		if (typeof (dataLayer) != "undefined") {
			for (let i = 0; i < dataLayer.length; i++) {
				if (dataLayer[i].PageType) {
					dLayer_pagetype = dataLayer[i].PageType;
					break;
				}
			}
		}
		formdata.pageType = dLayer_pagetype;
        const sendLink = () => {
            grecaptcha.ready(() => {
                grecaptcha.execute(googleRecaptchaKey, { action: 'submit' }).then((token) => {
                    formdata.recaptchaToken = token;
                    $.ajax({
                        type: "POST",
                        url: "/send-app-link",
                        data: formdata,
                        success: function (response) {
                            if (response.status) {
								if (typeof page != 'undefined' && page == 'homePage') {
									$('.desktopAppDownload .inputBox,.app-download .app-input-box').empty().append(
										$('<span/>', { class: 'success' }).append(
											$('<em/>', { class: 'icon-check' }),
											"Link Sent Successfully On Mobile Number."
										)
									)
								} else {
									$('#dekstopAppDownloadForm .sendAppLinkBtn').text('Link Sent!');
								}
                            } else {
                                helperJS.alertBox('error', response.message);
                            }
                        },
                        error: function () {
                            helperJS.alertBox('error', 'Something Went Wrong. Please Try Again Later');
                        }
                    });
                });
            });
        };
		if (typeof grecaptcha === 'undefined') {
            globalfn.globalGetScript(`https://www.google.com/recaptcha/api.js?render=${googleRecaptchaKey}`)
                .then(() => { sendLink(); })
                .catch(() => {
                    helperJS.alertBox('error', 'Something Went Wrong. Could not load reCAPTCHA');
                });
        } else {
            sendLink();
        }
    });
};



/* const globalTruecallerLoginInit = (reqid, options, originalOptions, jqXHR) => {
	const { host } = new URL(decodeURIComponent(escape(atob(userapiurl))));
	const socket = new WebSocket(`wss://${host}/ws/?reqid=${reqid}`);
	socket.onopen = () => {
		// console.log('WebSocket connection opened');
	};

	socket.onmessage = function (event) {
		const data = JSON.parse(event.data);
		if (data.partnerKey && data.reqid) {
			const lang = "en";
			const ttl = 300000;

			const sdkUrl = `truecallersdk://truesdk/web_verify?`
			+ `type=btmsheet`
			+ `&requestNonce=${data.reqid}`
			+ `&partnerKey=${data.partnerKey}`
			+ `&partnerName=Square%20Yards%20Real%20Estate`
			+ `&loginPrefix=continue`
			+ `&loginSuffix=verifymobile`
			+ `&ctaPrefix=continuewith`
			+ `&ctaColor=%23000000` // Black button
			+ `&ctaTextColor=%23FFFFFF` // White text
			+ `&btnShape=round` // Rounded button
			+ `&skipOption=manualdetails` // Shows SKIP
			+ `&lang=en`
			+ `&privacyUrl=https://www.squareyards.com/privacy`
			+ `&termsUrl=https://www.squareyards.com/terms`
			+ `&ttl=${ttl}`;

			window.location = sdkUrl;

			setTimeout(() => {
				if (document.hasFocus() && isTrueCaller != 1) {
					isTrueCaller = 0;
					jqXHR.abort();
					originalOptions._skipPrefilter = true;
					$.ajax(originalOptions);
				}
			}, 100);
		} else if (data && data.status === 1 && data.reqid && data.trueCallerData) {
			if (data.trueCallerData.status && data.trueCallerData.status == "flow_invoked") { // truecaller popup opens
				isTrueCaller = 1;
			} else if (data.trueCallerData.status && data.trueCallerData.status == "use_another_number") { // truecaller popup - skip button clicked
				isTrueCaller = 1;
				const newOptions = $.extend(true, {}, originalOptions);
				newOptions._skipPrefilter = true;
				$.ajax(newOptions);
			} else if (typeof data.trueCallerData.isActive != 'undefined' && data.trueCallerData.isActive == false) { // truecaller profile is inactive
				isTrueCaller = 0;
				helperJS.alertBox('error', 'Your Truecaller profile is inactive status. So, Please provide the details to continue.');
				const newOptions = $.extend(true, {}, originalOptions);
				newOptions._skipPrefilter = true;
				$.ajax(newOptions);
			} else if (data.trueCallerData.status && data.trueCallerData.status == "user_rejected") { // truecaller popup - user rejected or user press back button, so close truecaller popup
				isTrueCaller = 1;
			} else {
				isTrueCaller = 1;
				const newOptions = $.extend(true, {}, originalOptions);
				newOptions._skipPrefilter = true;

				let parsedData = {};
				try {
					if (typeof newOptions.data === 'string') {
						parsedData = JSON.parse(newOptions.data);
					} else if (typeof newOptions.data === 'object') {
						parsedData = newOptions.data;
					}
				} catch (e) {
					console.warn('Failed to parse originalOptions.data:', e);
				}

				parsedData.reqid = data.reqid;
				parsedData.trueCallerData = data.trueCallerData;

				if (typeof originalOptions.data === 'string') {
					newOptions.data = JSON.stringify(parsedData);
					newOptions.contentType = 'application/json; charset=UTF-8';
					newOptions.processData = false;
				} else {
					newOptions.data = parsedData;
				}

				if (originalOptions.headers) {
					newOptions.headers = $.extend(true, {}, originalOptions.headers);
				}

				const formid = parsedData.formid;
				const originalSuccess = newOptions.success;

				newOptions.success = async function (apiresponse, textStatus, jqXHR) {
					socket.close();
					$('#loaderBox').show();
					await globalfn.asyncSetUserHeaderMenu();
					if (typeof originalSuccess === 'function') {
						originalSuccess.call(this, apiresponse, textStatus, jqXHR);
						setTimeout(() => {
							if ($("#reqiddiv").attr("needUpdateProfile") == "yes") {
								$(`#${formid}_alreadyLead`).removeClass("active");
								$('body').off('click', '.select-bhk-box .bhk-list li');
								$('body').on('click', '.select-bhk-box .bhk-list li', function () {
									if ($(this).hasClass('more-units')) {
										$('.select-bhk-box .bhk-list li.hidden-unit').removeClass('hidden-unit');
										$(this).hide();
									}
									$(this).toggleClass('selected');
								});
								const countrycodeval = $(`#${formid}_dev_updateprofileform #updateprofile_countrycode`).val();
								const mobileval = $(`#${formid}_dev_updateprofileform #updateprofile_mobile`).val();
								$(`#${formid}_heading strong`).text(`Please provide the details to continue with mobile no ${countrycodeval}${mobileval}`);
								$(".globalOverflow").addClass("active"); $("body").addClass("scroll-lock");
								$(`#${formid}_dev_updateprofileform,#${formid}_leadForm`).addClass("active");
								$('#loaderBox').hide();
							} else {
								$(`#${formid}_filledLeadBox`).find(".dev_filledleadbtn").click();
							}
							$("#reqiddiv").show();
						}, 1000);
						// event for truecaller successful login
						if (typeof _paq != 'undefined' && globalfn.userDetails != undefined) {
							let eventName = 'True_Caller';
							const pageGroupMapping = {
								'NEW-PROJECT-DSE': 'project_dse',
								'NEW-PROJECT-DETAIL': 'newProject_Detail',
								'SALE-LISTING-DSE': 'resale_dse',
								'SALE-LISTING-DETAIL': 'Listing_Detail',
								'RENT-LISTING-DSE': 'rental_dse',
								'RENT-LISTING-DETAIL': 'Listing_Detail'
							};
							if (typeof pageGroup != 'undefined' && pageGroup && pageGroupMapping[pageGroup]) {
								eventName = pageGroupMapping[pageGroup];
							}
							const eventData = { pageUrl: window.location.pathname, DeviceType: isMobileBrowser() ? "Mobile" : "Desktop", Browser: globalfn.getDeviceModel() };
							const userData = globalfn.userDetails;
							['userName', 'userType', 'countryCode', 'mobile', 'email'].filter((item) => userData[item]).forEach((item) => { eventData[item] = userData[item]; });
							_paq.push(['trackEvent', eventName, 'True_caller_verified', JSON.stringify(eventData)]);
						}
					}
				};

				newOptions.error = function (jqXHR, textStatus, errorThrown) {
					socket.close();
					helperJS.alertBox('error', 'Something Went Wrong');

					// Call original error handler if it exists
					if (typeof originalOptions.error === 'function') {
						originalOptions.error.call(this, jqXHR, textStatus, errorThrown);
					}
				};

				$.ajax(newOptions);
			}
		}
	};

	socket.onerror = function (e) {
		console.error('WebSocket error:', e);
		jqXHR.abort();
		originalOptions._skipPrefilter = true;
		$.ajax(originalOptions);
	};

	socket.onclose = () => {
		// console.log('WebSocket closed');
	};
};

function globalTrueCallerLoginDataPost(options, originalOptions, jqXHR, parsedData) {
	const DotcomProjectId = typeof parsedData.DotcomProjectId != 'undefined' && parsedData.DotcomProjectId > 0 ? parsedData.DotcomProjectId : 0;
	const propertyId = typeof parsedData.userdetails != 'undefined' && typeof parsedData.userdetails.propertyId != 'undefined' ? parsedData.userdetails.propertyId : 0;
	const deviceModel = globalfn.getDeviceModel();

	const data = { pageUrl: window.location.pathname, reqData: { Browser: deviceModel } };
	if (DotcomProjectId > 0) {
		data.reqData.DotcomProjectId = DotcomProjectId;
	}
	if (propertyId > 0) {
		data.reqData.propertyId = propertyId;
	}

	const reqid = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
	data.reqData.id = reqid;
	globalTruecallerLoginInit(reqid, options, originalOptions, jqXHR);

	const url = `${baseUrl}user/truecaller-login-data`;
	$.ajax({
		type: 'post',
		url,
		data: JSON.stringify({ data }),
		contentType: 'application/json',
		processData: false
	});
}

function ajaxPreFilterForCommonLeadForm() {
	let _userData = globalfn.getUserDetails();
	let isUserLoggedIn = typeof _userData != 'undefined' && _userData && _userData.countryCode && _userData.mobile;
	if (isUserLoggedIn) {
		showFilledLeadForOtherForms("", _userData);
	}

	const isAndroid = /(android)/i.test(navigator.userAgent);
	if (isMobileBrowser() && isAndroid) {
		$.ajaxPrefilter((options, originalOptions, jqXHR) => {
			// Skip if we've already handled this request
			if (originalOptions._skipPrefilter) {
				return;
			}

			if (options.url && options.url.indexOf('/getcommonleadform') !== -1) {
				_userData = globalfn.getUserDetails();
				isUserLoggedIn = typeof _userData != 'undefined' && _userData && _userData.countryCode && _userData.mobile;

				const newOptions = $.extend(true, {}, originalOptions);
				let parsedData = {};
				try {
					if (typeof newOptions.data === 'string') {
						parsedData = JSON.parse(newOptions.data);
					} else if (typeof newOptions.data === 'object') {
						parsedData = newOptions.data;
					}
				} catch (e) {
					console.warn('Failed to parse originalOptions.data:', e);
				}

				const formaction = typeof parsedData.formaction != 'undefined' ? parsedData.formaction : '';
				const leadviewinpopup = typeof parsedData.leadviewinpopup != 'undefined' ? parsedData.leadviewinpopup : '';
				const pageCategory = typeof parsedData.pageCategory != 'undefined' ? parsedData.pageCategory : '';

				if (isUserLoggedIn || isTrueCaller == 0 || formaction.toLowerCase() == 'whatsapp' || leadviewinpopup == false || pageCategory == 'azadi-tour') {
					jqXHR.abort();
					originalOptions._skipPrefilter = true;
					$.ajax(originalOptions);
				} else {
					jqXHR.abort();
					globalTrueCallerLoginDataPost(options, originalOptions, jqXHR, parsedData);
				}
			}
		});
	}
} */

if (typeof page != 'undefined' && page == 'homePage') initAppLinkSender();