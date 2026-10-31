async function headercityselect(cityname, itemCityId, dotcomCityId, saleCount, rentCount) {
	if ($(`a.redirect_to[slugcityname='${cityname}']`).length > 0) {
		$(`a.redirect_to[slugcityname='${cityname}']`).click();
	} else if ($("#SearchMobile").hasClass("partialactive") == true) {
		$('#loaderBox').show();
		if (typeof saleCount == 'undefined' && typeof rentCount == 'undefined' && dotcomCityId == 0 && $(".propertyTab[data-tag='agent']").hasClass("fixedTab") == false) { // no listings & projects in this city, so select agent by default
			newMobileSearchProp.showLoader();
			$('#homeTabs .parentTabDiv div.propertyTab').removeClass('fixedTab');
			$(".propertyTab[data-tag='agent']").addClass('fixedTab');
			$('.propertyTab').detach().appendTo('.scrollTab');
			$(".propertyTab[data-tag='agent']").detach().prependTo('.propertyTabBox');
			$('#mobileSearchSubmitButton').removeClass();
			newMobileSearchProp.activeMobileSearchTab = $(".propertyTab[data-tag='agent']").data('tag');
			newMobileSearchProp.setCookie('hometab', 'agents');
			$('#mobileSearchSubmitButton').addClass('Home_Search_L32 btn btn-primary');
			await newMobileSearchProp.showFilterPopup("header_city_popup");
			await headercityselect(cityname, itemCityId, dotcomCityId, saleCount, rentCount);
			newMobileSearchProp.hideLoader();
			return false;
		}

		let searchcityid = dotcomCityId;
		const mobileSearchCityType = $("input[name='mobileSearchCityType']").val();

		if (mobileSearchCityType != "new_project") {
			searchcityid = itemCityId;
		}

		const searchcityname = cityname;
		$("input[name='mobileSearchCityId']").val(searchcityid);
		$("input[name='mobileSearchCityName']").val(searchcityname);
		if (typeof (chipArray) != 'undefined') chipArray = [];
		if (typeof (npChipArray) != 'undefined') npChipArray = [];
		if (typeof (agentbadgeArray) != 'undefined') agentbadgeArray = [];
		const globalselectedCity = { id: searchcityid, name: searchcityname };
		helperJS.setCookie('_selcity', globalselectedCity, 24 * 60 * 60);

		$("#gblCityBox , #dev_headercitypopup_container").removeClass('active');
		$("#SearchMobile").removeClass("partialactive");
		$("#SearchMobile").addClass("active");
		$("#dev_headeroverlay").css("display", "none");

		let tabCounts;
		if ($("header").attr("page") == 'reviewDse') {
			await ratingDSEMobileSearch.showFilterPopup();
		} else {
			if ($('input[type=hidden][name=mobileSearchCityName]').val() != '') {
				tabCounts = await newMobileSearchProp.getpropertyCount($('input[type=hidden][name=mobileSearchCityName]').val());
			}
			await newMobileSearchProp.renderFilterTab(tabCounts);
			await newMobileSearchProp.showFilterPopup();
		}
		$('#loaderBox').hide();
		return false;
	} else if (typeof saleCount == 'undefined' && typeof rentCount == 'undefined' && dotcomCityId == 0) { // no listings & projects in this city, so select agent by default
		const globalselectedCity = { id: "0", name: "India" };
		helperJS.setCookie('_selcity', globalselectedCity, 24 * 60 * 60);
		setTimeout(() => {
			window.location.href = "/";
		});
	} else {
		const redirect_to = `/${helperJS.slugify(cityname)}-real-estate`;
		const searchcityid = dotcomCityId;
		const searchcityname = cityname;
		const globalselectedCity = { id: searchcityid, name: searchcityname };
		helperJS.setCookie('_selcity', globalselectedCity, 24 * 60 * 60);
		window.location.href = redirect_to;
	}
}

$(document).ready(() => {
	$("#gblCityBox").on('click', (e) => {
		e.stopPropagation();
	});
	$(".navOverflow").on("click", () => {
		$("header nav ,#nav-toggle,header .topRightBox li.login .profile, #gblCityBox, #gblCityBtn").removeClass("active");
	});
	$('.gblCityBox .gblCityBody .gblSearchBox button.close,.gblCityBox .gblHeader em').on("click", () => {
		$('#gblCityBox,.gblOverflow,#gblCityBtn,#dev_headercitypopup_container,#SearchMobile').removeClass('active'); $('body').removeClass('active scroll-lock');
		$("#dev_headeroverlay").css("display", "none");
		const _selcity = helperJS.getCookie('_selcity');
		const cityid = _selcity != null ? _selcity.id : 0;
		if ((cityid == 0 || cityid == '0') && $("#SearchMobile").hasClass("partialactive")) {
			$("#SearchMobile").removeClass("partialactive");
		} else if ($("#SearchMobile").hasClass("partialactive")) {
			$("#SearchMobile").removeClass("partialactive");
			$("#SearchMobile").addClass("active");
			$('body').addClass('scroll-lock');
		}
	});

	const otherCityPayload = {
		page: $("header").attr("page") || '',
		currenturl: window.location.pathname || ''
	};

	$.ajax({
		url: `${baseUrl}getheaderothercitypopup?${otherCityPayload.page ? `page=${otherCityPayload.page}&` : ''}${otherCityPayload.currenturl ? `currenturl=${otherCityPayload.currenturl}` : ''}`,
		dataType: "html",
		type: "GET",
		success(othercityhtml) {
			$(".allCitiesBoxx").html(othercityhtml);
			if (typeof globalfn != 'undefined') globalfn.redirectToClick();
		}
	});

	// INP: debounce the city show/hide loop so it runs once per typing burst, not per keystroke
	let _headerCitySearchTimer = null;
	$('#headerSearchCity').on('keyup', function () {
		const self = this;
		if (_headerCitySearchTimer) clearTimeout(_headerCitySearchTimer);
		_headerCitySearchTimer = setTimeout(function () {
			const searchValue = $(self).val().trim().toLowerCase();
			let topCities = false;
			let otherCities = false;

			$(".headercityli").each(function () {
				const cityName = $(this).find(".redirect_to").attr("cityname").toLowerCase();

				if (searchValue === "" || cityName.includes(searchValue)) {
					$(this).show();
					if ($(this).closest(".topCitiesBoxx").length > 0) topCities = true;
					if ($(this).closest(".allCitiesBoxx").length > 0) otherCities = true;
				} else {
					$(this).hide();
				}
			});

			$(".topCitiesBoxx").toggle(topCities);
			$(".allCitiesBoxx").toggle(otherCities);
		}, 120);
	});

	function setCityByPosition(position) {
		$.post('/openstreetgeocode', { lat: position.coords.latitude, long: position.coords.longitude }, async (res) => {
			let city = res.address.city || "";
			const cityParts = city.split(' ');
			if (cityParts.length > 0) {
				city = cityParts[0];
			}
			if (city.trim() == 'Gurugram') {
				city = 'Gurgaon';
			}
			if (city.trim() == 'Bengaluru') {
				city = 'Bangalore';
			}

			$(".headercityli").each(function () {
				const cityElem = $(this).find(".redirect_to");
				const cityName = $(cityElem).attr("cityname").toLowerCase().trim();
				if (cityName == city.toLowerCase().trim()) {
					$(cityElem).click();
				}
			});
		});
	}

	$(".detectMyLocation").on("click", () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(setCityByPosition, (err) => {
				alert(`ERROR(${err.code}): Near me properties can only be seen if you will provide location access, Please enable location access or turn on gps to browse near by property listings`);
			});
		} else {
			alert("Geolocation is not supported by this browser.");
		}
	});

	$("#resetCity").on("click", () => {
		document.cookie = "_selcity=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
		setTimeout(() => {
			window.location.href = baseUrl;
		}, 0);
	});

	// $('#gblCityBtn').trigger('click');
});
