let cityIdCM = 0;
let cityNameCM = '';
let tabCM = '';
let metroCityFlagRT = false;
const newSearchPopUpClicked = false;

function searchbytype(metroCityFlagRT) {
	return $("<ul/>", { class: 'sySearchList', id: 'searchbytype' })
		.append($("<li/>", { id: 'searchcommute' })
			.append($("<i/>", { class: 'vehicleIco' })
				.append($("<img/>", { src: '/assets/images/commute-icon/between.svg', alt: '' })))
			.append($("<span/>", { text: 'Search by ' })
				.append($("<b/>", { text: 'Travel Time' }))))
		.append((function () {
			const metroTabHtml = [];
			if (metroCityFlagRT == true) {
				metroTabHtml.push($("<li/>", { id: 'searchmetro' })
					.append($("<i/>", { class: 'vehicleIco' })
						.append($("<img/>", { src: '/assets/images/commute-icon/metro.svg', alt: '' })))
					.append($("<span/>", { text: 'Search by ' })
						.append($("<b/>", { text: 'Metro' }))));
			}
			return metroTabHtml;
		})());
}

// $("body").on('focus', "#chipDiv input,#searchtextDSE,#searchtext", async function () {
// $("body").on('focus', "#searchtextDSE,#searchtext", async function () {
// 	if (typeof language == 'undefined' || language == 'en') {
// 		await setActiveTabCommuteMetro();
// 		// await checkMetro(cityIdCM, cityNameCM, tabCM, searchFocus = true, focusElem = $(this));
// 		metroCityFlagRT = true; // set value
// 	}
// 	// Eventn search on listing dse
// 	if (typeof ltype != 'undefined' && ltype && typeof _paq !== 'undefined') {
// 		const eventName = { "pageUrl": window.location.pathname, "DeviceType": globalIsIpadBrowser ? "Mobile" : "Desktop", Browser : globalfn.getDeviceModel() };
// 		_paq.push(['trackEvent', ltype == "Rent" ? "rental_dse" : "resale_dse", 'Common_search', JSON.stringify(eventName)]);
// 	}
// });

// $("body").on('blur', "#chipDiv input,#searchtextDSE,#searchtext", function () {
// 	setTimeout(() => {
// 		$("#searchbytype").removeClass('active');
// 	}, 500);
// });

$("body").on('click', '.commute-search-trigger', async function () {
	let lastClickedTriggerId = $(this).attr('id'); 
	let dLayer_pagetype = '';
		if (typeof (dataLayer) != "undefined") {
			for (let i = 0; i < dataLayer.length; i++) {
				if (dataLayer[i].PageType) {
					dLayer_pagetype = dataLayer[i].PageType;
					break;
				}
			}
	}
	if (newSearchPopUpClicked == false) {
		await setActiveTabCommuteMetro();
		// await checkMetro(cityIdCM, cityNameCM, tabCM, searchFocus = false, focusElem = '');
		if ($('#searchmetro').length) {
			metroCityFlagRT = true;
		} else if (typeof commonSearchFn != 'undefined' && commonSearchFn.cityData && commonSearchFn.cityData.isMetroLines) {
			metroCityFlagRT = true;
		} else {
			metroCityFlagRT = false;
		}
	}
	if ($(this).attr('id') == 'searchmetro') {
		// Events on click of metro
		if (typeof ltype != 'undefined' && ltype && typeof _paq !== 'undefined') {
			const eventName = { pageUrl: window.location.pathname, DeviceType: globalIsIpadBrowser ? "Mobile" : "Desktop", Browser: globalfn.getDeviceModel() };
			_paq.push(['trackEvent', ltype == "Rent" ? "rental_dse" : "resale_dse", 'Near_Metro_Station', JSON.stringify(eventName)]);
		}
	}
    if(dLayer_pagetype == 'HOME' && $(".common-mobile-search.active").length == 0 && commonSearchFn.cityName == 'India'){
		commonSearchFn.openCityPopup(tabCM, lastClickedTriggerId);
	}else{
	    initializeMetroCommutePopup(cityIdCM, cityNameCM, metroCityFlagRT, tabCM, clickedItemId = $(this).attr('id'));
	}
});

async function setActiveTabCommuteMetro() {
	let dLayer_pagetype = '';
	if (typeof (dataLayer) != "undefined") {
		for (let i = 0; i < dataLayer.length; i++) {
			if (dataLayer[i].PageType) {
				dLayer_pagetype = dataLayer[i].PageType;
				break;
			}
		}
	}
	if (dLayer_pagetype == 'HOME' || dLayer_pagetype == 'CITY-HOME') {
		let activeTabMetro = $("input[name='commonSearchHomeTab']").val() || $('.common-search .property-tab-list li.active').attr("hometab") || $('.search-box .property-tab-list li.active').attr("hometab") || '';
		let cityValNP = dotcomCityId;
		let cityValRR = beatsCityId;
		cityNameCM = cityName;

		if ($(".common-mobile-search.active").length > 0 || !isMobileBrowser()) {
			cityValNP = $("input[name='commonSearchDotcomCityId'").val();
			cityValRR = $("input[name='commonSearchBeatsCityId'").val();
			cityNameCM = $("input[name='commonSearchCityName'").val();
		}

		if (activeTabMetro.toLowerCase().indexOf('newp') != -1) {
			tabCM = 'newProjects';
			cityIdCM = cityValNP || 0;
		} else if (activeTabMetro.toLowerCase().indexOf('sale') != -1 || activeTabMetro.toLowerCase().indexOf('plot') != -1) {
			tabCM = 'resale';
			cityIdCM = cityValRR || 0;
		} else if (activeTabMetro.toLowerCase().indexOf('rent') != -1 ||  activeTabMetro.toLowerCase().indexOf('pg') != -1) {
			tabCM = 'rental';
			cityIdCM = cityValRR || 0;
		} else if (activeTabMetro.toLowerCase().indexOf('commercial') != -1) {
			tabCM = $(`.common${isIpadBrowser() ? '-mobile' : ''}-search .apply-filter[type='transaction'].active`).attr('value') == "resale" ? "resale" : "rental";
			cityIdCM = cityValRR || 0;
		} else {
			tabCM = '';
			cityIdCM = 0;
		}
	} else if (dLayer_pagetype == 'DSE') {
		tabCM = 'newProjects';
		cityIdCM = cityid;
		cityNameCM = _selectedCity.name;
		if ($(".common-mobile-search.active").length > 0) {
			cityIdCM = $("input[name='commonSearchDotcomCityId'").val();
			cityNameCM = $("input[name='commonSearchCityName'").val();
		}
	} else if (dLayer_pagetype == 'LISTINGRESALE' || dLayer_pagetype == 'LISTINGRENTAL') {
		if (dLayer_pagetype == 'LISTINGRESALE') {
			tabCM = 'resale';
		} else {
			tabCM = 'rental';
		}
		cityIdCM = cityId;
		cityNameCM = cityName;
		if ($(".common-mobile-search.active").length > 0) {
			cityIdCM = $("input[name='commonSearchBeatsCityId'").val();
			cityNameCM = $("input[name='commonSearchCityName'").val();
		}
	} else if ($(".common-mobile-search.active").length > 0) {
		const activeTabMetro = helperJS.getCookie('hometab');
		cityValNP = $("input[name='commonSearchDotcomCityId'").val();
		cityValRR = $("input[name='commonSearchBeatsCityId'").val();
		cityNameCM = $("input[name='commonSearchCityName'").val();
		if (activeTabMetro.toLowerCase().indexOf('newp') != -1) {
			tabCM = 'newProjects';
			cityIdCM = cityValNP || 0;
		} else if (activeTabMetro.toLowerCase().indexOf('sale') != -1 || activeTabMetro.toLowerCase().indexOf('plot') != -1) {
			tabCM = 'resale';
			cityIdCM = cityValRR || 0;
		} else if (activeTabMetro.toLowerCase().indexOf('rent') != -1) {
			tabCM = 'rental';
			cityIdCM = cityValRR || 0;
		} else if (activeTabMetro.toLowerCase().indexOf('commercial') != -1) {
			tabCM = $(`.common${isIpadBrowser() ? '-mobile' : ''}-search .apply-filter[type='transaction'].active`).attr('value') == "resale" ? "resale" : "rental";
			cityIdCM = cityValRR || 0;
		} else {
			tabCM = '';
			cityIdCM = 0;
		}
	}
}

// async function checkMetro(cityIdCM, cityNameCM, tabCM, searchFocus = false, focusElem = '') {
// 	await $.ajax({
// 		async: true,
// 		dataType: "json",
// 		contentType: "application/json",
// 		type: "POST",
// 		url: "/get-metro-commute-data",
// 		data: JSON.stringify({ 'cityId': cityIdCM, 'cityName': cityNameCM, 'tabCM': tabCM }),
// 		success(data) {
// 			metroCityFlagRT = data.metroFlagNew;
// 			let dLayer_pagetype = '';
// 			if(typeof(dataLayer)!= "undefined"){
// 				for(let i=0; i<dataLayer.length; i++){
// 					if(dataLayer[i].PageType){
// 					dLayer_pagetype=dataLayer[i].PageType;
// 					break;
// 					}
// 				}
// 			}
// 			if(searchFocus == true){
// 				if(!isMobileBrowser()){
// 					$('#searchbytype').remove();
// 					if(tabCM == 'newProjects' || tabCM == 'resale' || tabCM == 'rental' || tabCM != ''){
// 						if(dLayer_pagetype == 'CITY-HOME'){
// 							focusElem.parent().parent().append(searchbytype(metroCityFlagRT))
// 							$("#searchbytype").addClass('active');
// 						}else{
// 							focusElem.parent().parent().siblings('.autoComplete').children().append(searchbytype(metroCityFlagRT))
// 							$(".autoComplete").addClass('active');
// 						}
// 					}
// 				}
// 			}
// 		},
// 		error(error){
// 		console.log(error);
// 		}
// 	});
// }

function initializeMetroCommutePopup(cityIdCommuteMetro, commuteCityName, metroCityFlag, tabCM, clickedItemId) {
	let selectedAdd;
	let nearMeLatitude;
	let nearMeLongitude;
	let stationsChecked = [];

	$.ajax({
		async: true,
		dataType: "html",
		contentType: "application/json",
		type: "POST",
		url: "/get-metro-commute-html",
		data: JSON.stringify({ cityId: cityIdCommuteMetro, cityName: commuteCityName, metroCityFlag, tabCM }),
		success(data) {
			if ($("#commutemetropopup").length == 0) {
				$('body').append(
					$('<div/>', { id: 'commutemetropopup', class: 'globalModal commuteModal' })
				);
				globalfn.loadcssfile('/assets/css/commuteMetroSearch.css');
			}
			$("#commutemetropopup").html(data);
			if (isMobileBrowser() && $('.common-mobile-search.active').length) {
				$("#commutemetropopup").find('.cancel').attr('from','.common-mobile-search');
				$('.common-mobile-search').removeClass('active');
			} else if ($('.common-search .common-search-input').length) {
				$('.common-search .search-filter-dropdown').removeClass('active');
				$("#commutemetropopup").find('.cancel').attr('from','.common-search .common-search-input');
			}
			setCommuteMetroPopup(clickedItemId);
			setCommuteAutoComplete();
			if (metroCityFlag == true) {
				setMetroAutoComplete();
			}
		},
		error(error) {
			console.log(error);
		}
	});

	$("body").on("click", '.syCommuteBox .closeBtn, .syCommuteBox .cancel', function () {
		let from = '';
		if ($(this).attr('from')) {
			from = $(this).attr('from');
		}
		resetCommuteMetroPopup(from);
	});

	$("body").on("click", '.syCommuteTab li', function () {
		$("#commutemetrosubmitbtn").css('display', 'none');
		$(".syCommuteTab li").removeClass('active');
		$(".sySearchBody").removeClass('active');
		$('#commuteautoCompletedropdown ul').removeClass('focusValue');
		$('.sySearchRoute ul').removeClass('focusValue');
		if (isMobileBrowser()) {
			$(".syDistanceBox").css('margin-bottom', 70);
			$(".syBtnBox").css('display', 'block');
		} else {
			$(".syDistanceBox").css('margin-bottom', 0);
			$(".syBtnBox").css('display', 'none');
		}
		$(this).addClass('active');
		if ($(".sySearchBody").hasClass('searchcommute') == $(this).hasClass('searchcommute')) {
			$(".sySearchBody.searchcommute").addClass('active');
			$('#commuteLocation').val('');
			$(".syHeadingBox").css('display', 'block');
			$(".sySearchBox").css('display', 'block');
			$(".syBackBtnBox").css('display', 'none');
			$(".selectList").remove();
			$('.syDistanceBox input[type="checkbox"]').prop('checked', false);
			stationsChecked = [];
		} else {
			$("#SearchLines").val('');
			$(".sySearchBody.searchmetro").addClass('active');
			$(".syDistanceBox").css('display', 'none');
			$(".syMetroRoute").css('display', 'block');
			$(".selectList").remove();
			$('.syDistanceBox input[type="checkbox"]').prop('checked', false);
			stationsChecked = [];
		}
	});

	function setCommuteMetroPopup(clickedItemId) {
		$('body').addClass('scroll-lock');
		$('.commuteModal').addClass('active');
		$('.globalOverflow').addClass('active');
		$('.globalOverflow').addClass('setZindex26');
		$('#commuteautoCompletedropdown ul').removeClass('focusValue');
		$('.sySearchRoute ul').removeClass('focusValue');
		if (isMobileBrowser()) {
			$(".syDistanceBox").css('margin-bottom', 70);
			$(".syBtnBox").css('display', 'block');
		} else {
			$(".syBtnBox").css('display', 'none');
			$(".syDistanceBox").css('margin-bottom', 0);
		}
		$("#commutemetrosubmitbtn").css('display', 'none');
		if (clickedItemId == 'searchcommute' || clickedItemId == 'searchbycommute') {
			$("#searchbytype").removeClass('active');
			$(".syCommuteTab li.searchmetro").removeClass('active');
			$(".sySearchBody.searchmetro").removeClass('active');
			$(".syCommuteTab li.searchcommute").addClass('active');
			$(".sySearchBody.searchcommute").addClass('active');
			$('#commuteLocation').val('');
			// Events on click of travel time
			if (typeof ltype != 'undefined' && ltype && typeof _paq !== 'undefined') {
				const eventName = { pageUrl: window.location.pathname, DeviceType: globalIsIpadBrowser ? "Mobile" : "Desktop", Browser: globalfn.getDeviceModel() };
				_paq.push(['trackEvent', ltype == "Rent" ? "rental_dse" : "resale_dse", 'Travel_Time', JSON.stringify(eventName)]);
			}
		} else {
			$(".syCommuteTab li.searchcommute").removeClass('active');
			$(".sySearchBody.searchcommute").removeClass('active');
			$(".syCommuteTab li.searchmetro").addClass('active');
			$(".sySearchBody.searchmetro").addClass('active');
			$("#SearchLines").val('');
		}
	}

	function resetCommuteMetroPopup(from = '') {
		$('.commuteModal').removeClass('active');
		$(".syCommuteTab li").removeClass('active');
		$(".sySearchBody").removeClass('active');
		$("#searchbytype").removeClass('active');
		$('body').removeClass('active scroll-lock');
		$('.globalOverflow').removeClass('active');
		$('.globalOverflow').removeClass('setZindex26');
		$("#SearchLines").val('');
		$('#commuteLocation').val('');
		$("#commutemetrosubmitbtn").css('display', 'none');
		$(".globalSearchBox").removeClass('active');
		$('#commuteautoCompletedropdown ul').removeClass('focusValue');
		$('.sySearchRoute ul').removeClass('focusValue');
		if (isMobileBrowser()) {
			$(".syDistanceBox").css('margin-bottom', 70);
			$(".syBtnBox").css('display', 'block');
		} else {
			$(".syDistanceBox").css('margin-bottom', 0);
			$(".syBtnBox").css('display', 'none');
		}
		if (from) {
			if (from == '.common-search .common-search-input') {
				$(from).trigger('focus');
			} else {
				$(from).addClass('active');
			}
		}
	}

	function selectedStations(stations) {
		return $("<ul/>", { class: 'selectList', style: 'display:none;' })
			.append((function () {
				const stationsHtml = [];
				if (stations.length <= 3) {
					stations.forEach((ele) => {
						stationsHtml.push($("<li/>")
							.append($("<span/>", { text: ele.station }))
							.append($("<em/>", { class: "close", Id: ele.stationId })));
					});
				} else {
					stations.forEach((ele, i) => {
						if (i < 3) {
							stationsHtml.push($("<li/>")
								.append($("<span/>", { text: ele.station }))
								.append($("<em/>", { class: "close", Id: ele.stationId })));
						}
					});
				}
				return stationsHtml;
			})())
			.append((function () {
				const stationMoreHtml = [];
				if (stations.length > 3) {
					stationMoreHtml.push($("<li/>")
						.append($("<span/>", { text: `${stations.length - 3} More` })));
				}
				return stationMoreHtml;
			})());
	}

	function setCommuteAutoComplete() {
		$("#commuteLocation").autocomplete({
			appendTo: $("#commuteautoCompletedropdown"),
			source(request, response) {
				searchTerm = request.term;
				cName = commuteCityName;
				term = request.term;
				if (cName) {
					term = `${cName} ${term}`;
				}
				$.ajax({
					type: "POST",
					url: '/googleApiSuggestion',
					data: {
						term
					},
					success(data) {
						const resp = [];
						if (cName) {
							const lowerCName = cName.toLowerCase();
							for (const item of data.data) {
								const lowerDescription = item.description.toLowerCase();
								if (lowerDescription.includes(lowerCName)) {
									resp.push(item);
								}
							}
							response(resp);
						} else {
							response(data.data);
						}
					}
				});
			},
			autoFocus: true,
			minLength: 3,
			async select(event, ui) {
				$(".syBtnBox").css('display', 'block');
				$("#commutemetrosubmitbtn").css('display', 'block');
				selectedAdd = ui.item.description;
				selectedAdd = selectedAdd.replace("&", "");
				try {
					const res = await $.post('/googlePlaceLatLng', { destinations: selectedAdd });
					nearMeLatitude = res.data.lat;
					nearMeLongitude = res.data.lng;

					setTimeout(() => {
						$('#commuteLocation').val(ui.item.description);
					});

					$('#commuteautoCompletedropdown ul').removeClass('focusValue');
				} catch (error) {
					console.error("Error fetching latitude and longitude:", error);
				// alert("Failed to fetch location details. Please try again.");
				}
			}
		}).autocomplete("instance")._renderItem = function (ul, item) {
			$(".syCommuteSearch").addClass("active");
			const lihtml = `<em class="icon-location-pointer"></em><span>${boldSearchText(item.description, searchTerm)}</span>`;
			ul.addClass('focusValue');
			return $("<li>").append(lihtml).appendTo(ul);
		};

		$("#commuteLocation").on('input', function () {
			$("#commutemetrosubmitbtn").css('display', 'none');
			if (!isMobileBrowser()) {
				$(".syBtnBox").css('display', 'none');
			}
			const inputValue = $(this).val();
			if (inputValue === '') {
				$('#commuteautoCompletedropdown ul').removeClass('focusValue');
				if (isIpadBrowser()) {
					$(".syBtnBox").css('display', 'block');
				}
			}
		});
	}

	function setMetroAutoComplete() {
		$("#SearchLines").autocomplete({
			appendTo: $(".sySearchRoute"),
			source(request, response) {
				searchTerm = request.term;
				cName = commuteCityName;
				term = request.term;
				$.ajax({
					type: "POST",
					url: '/metroStationSearchApi',
					data: {
						term,
						cityId: cityIdCommuteMetro,
						tabCM
					},
					success(data) {
						if (data.data.length <= 0) {
							data.data.push({ refId: 0, refName: 'No Station Found' });
						}
						response(data.data);
					}
				});
			},
			autoFocus: true,
			minLength: 3,
			select(event, ui) {
				const stationParent = $(`.syDistanceBox.${ui.item.parentname.toLowerCase().trim().split(' ').join('-')}`);
				$('#SearchLines').val("");
				$(".sySearchRoute").css('display', 'none');
				const searchedStation = { station: ui.item.name, stationId: (ui.item.id).toString() };
				stationsChecked.push(searchedStation);
				if (stationsChecked.length) {
					$(".syBtnBox").css('display', 'block');
					$("#commutemetrosubmitbtn").css('display', 'block');
					$(".sySearchBody.searchmetro .syHeadingBox").css('display', 'none');
					$(".sySearchBody.searchmetro .sySearchBox").css('display', 'none');
					stationParent.css('display', 'block');
					$(".syBackBtnBox").css('display', 'block');
					$(".selectList").remove();
					if (stationsChecked.length > 0) {
						$(".syBtnBox").prepend(selectedStations(stationsChecked));
						$(".selectList").show();
					}
					stationParent.find(`strong:contains(${ui.item.name})`).closest("li").find("input[type='checkbox']").prop("checked", true);
					if ($(".syBtnBox")[0].offsetHeight <= 120 && $(".syBtnBox")[0].offsetHeight >= 90) {
						$(".syDistanceBox").css('margin-bottom', 125);
					} else if ($(".syBtnBox")[0].offsetHeight > 120) {
						$(".syDistanceBox").css('margin-bottom', 165);
					} else if ($(".syBtnBox")[0].offsetHeight < 90) {
						if (isMobileBrowser()) {
							$(".syDistanceBox").css('margin-bottom', 70);
						} else {
							$(".syDistanceBox").css('margin-bottom', 0);
						}
					}
				}
				stationName = ui.item.name;
				stationid = ui.item.id;
				setTimeout(() => {
					$('#SearchLines').val(ui.item.name);
				});
				$('.sySearchRoute ul').removeClass('focusValue');
			}
		});
		const acInstance = $("#SearchLines").data("ui-autocomplete");
		if (acInstance) {
			acInstance._renderItem = function (ul, item) {	
			$(".sySearchRoute").css('display', 'block');
			ul.addClass('syBetweenStation focusValue');
			$(".syMetroRoute").css('display', 'none');
			let lihtml = '';
			if (item.refId == 0) {
				lihtml = `${item.refName}`;
				return $(`<li class="notFound">`).append(lihtml).appendTo(ul);
			} else {
				$(".sySearchRoute .station").css('display', 'block');
				if (item.isinterchange) {
					lihtml = `<div class="syStation"><span class="line"><span class="${item.parentname.toLowerCase().trim().split(' ').join('-')}"></span>`;

					item.interchangelines.forEach((lineColours) => {
						lihtml += `<span class="${lineColours.toLowerCase().trim().split(' ').join('-')}"></span>`;
					});

					lihtml += `</span><strong>${item.name}</strong></div>
			<div class="syLineColor"><em><img src="assets/images/commute-icon/shuffle.svg" alt=""></em><span class="${item.parentname.toLowerCase().trim().split(' ').join('-')}">${item.parentname}</span>`;

					item.interchangelines.forEach((lineColours) => {
						lihtml += `<span class="${lineColours.toLowerCase().trim().split(' ').join('-')}">${lineColours}</span>`;
					});

					lihtml += `</div>`;
				} else {
					lihtml = `<div class="syStation"><span class="circle"><span class="${item.parentname.toLowerCase().trim().split(' ').join('-')}"></span></span><strong>${item.name}</strong></div><div class="syLineColor"><span class="${item.parentname.toLowerCase().trim().split(' ').join('-')}">${item.parentname}</span></div>`;
				}
			}
			return $("<li>").append(lihtml).appendTo(ul);
		};
	}

		$("#SearchLines").on('input', function () {
			if ($(this).val().length < 3) {
				$(".syMetroRoute").css('display', 'block');
				$(".sySearchRoute").css('display', 'none');
			}
			if ($(this).val().length == 0) {
				$('.sySearchRoute ul').removeClass('focusValue');
			}
		});
	}

	$(document).ready(() => {
		$('body').on('click', '#commutemetrosubmitbtn', () => {
			let redirect_url = '';
			if ($('.searchcommute').hasClass('active')) {
				if (($('#commuteLocation').val() == '') || ($('#commuteLocation').val().length == 0)) {
					$('#commutetraveltooltip').addClass('active');
					setTimeout(() => {
						$('#commutetraveltooltip').removeClass('active');
					}, 2000);
				} else {
					$('.globalOverflow').removeClass('active');
					$('.commuteModal').removeClass('active');
					$('body').removeClass('active scroll-lock');
					if (tabCM == 'resale' || tabCM == 'rental') {
						redirect_url = `${window.location.origin}/${tabCM}/search?&lat=${nearMeLatitude}&long=${nearMeLongitude}&commuteSearch=${selectedAdd}&cityId=${cityIdCommuteMetro}`;
						if ($("input[name='commonSearchHomeTab']").length > 0) {
							const hometabval = $("input[name='commonSearchHomeTab']").val().toLowerCase();
							if (hometabval == "plot") {
								redirect_url += "&buildingType=1,2&propertyType=4,10&propertyTypeName=Plot,Land";
							} else if (hometabval == "commercial") {
								redirect_url += "&buildingType=2";
							}else if (hometabval == "pg") {
								redirect_url += "&buildingType=1&propertyType=21&propertyTypeName=Pg";
							}
						}
					} else if (tabCM == 'newProjects') {
						if (typeof nearMeLatitude === 'undefined' || typeof nearMeLongitude === 'undefined') {
							redirect_url = window.location.origin;
						} else {
							redirect_url = `${window.location.origin}/search?landmarkId=${nearMeLatitude}|${nearMeLongitude}|${selectedAdd.split(',')[0]}${cityIdCommuteMetro != 0 ? `&cityName=${commuteCityName}&cityid=${cityIdCommuteMetro}` : ''}`;
						}
					}
					window.location.href = redirect_url;
					return false;
				}
			} else if ($(".selectList").length > 0) {
				if ($('.selectList').html().length == 0) {
					$('#metrotraveltooltip').addClass('active');
					setTimeout(() => {
						$('#metrotraveltooltip').removeClass('active');
					}, 2000);
				} else {
					$('.globalOverflow').removeClass('active');
					$('.commuteModal').removeClass('active');
					$('body').removeClass('active scroll-lock');
					if (tabCM == 'newProjects' || tabCM == 'resale' || tabCM == 'rental') {
						if (typeof stationsChecked === 'undefined' && stationsChecked.length <= 0) {
							redirect_url = window.location.origin;
						} else {
							const stationIds = [];
							stationsChecked.forEach((id) => {
								stationIds.push(id.stationId);
							});
							if (tabCM == 'newProjects') {
								redirect_url = `${window.location.origin}/search?cityid=${cityIdCommuteMetro}&commuteId=${stationIds}&map=1`;
							} else {
								redirect_url = `${window.location.origin}/${tabCM}/search?cityId=${cityIdCommuteMetro}&commuteId=${stationIds}&map=1`;
								if ($("input[name='commonSearchHomeTab']").length > 0) {
									const hometabval = $("input[name='commonSearchHomeTab']").val().toLowerCase();
									if (hometabval == "plot") {
										redirect_url += "&buildingType=1,2&propertyType=4,10&propertyTypeName=Plot,Land";
									} else if (hometabval == "commercial") {
										redirect_url += "&buildingType=2";
									}else if (hometabval == "pg") {
										redirect_url += "&buildingType=1&propertyType=21&propertyTypeName=Pg";
									}
								}
							}
						}
					}
					window.location.href = redirect_url;
					return false;
				}
			}
		});

		$("body").on('click', '.syMetroRoute li', function () {
			const line = $(this).attr('class');
			$(`#${line}`).css('display', 'block');
			$(".syMetroRoute").css('display', 'none');
			$(".syBackBtnBox").css('display', 'block');
			$(".syHeadingBox").css('display', 'none');
			$(".sySearchBox").css('display', 'none');
		});

		$('body').on('click', '.syDistanceBox li .syLineColor input[type="checkbox"]', function () {
			const station = { station: $(this).closest('li').find('strong').text(), stationId: $(this).attr('Id') };
			if ($(this).prop('checked')) {
				stationsChecked.push(station);
			} else {
				stationsChecked = stationsChecked.filter((item) => item.stationId !== station.stationId);
			}
			$(".selectList").remove();

			if (stationsChecked.length > 0) {
				$(".syBtnBox").css('display', 'block');
				$("#commutemetrosubmitbtn").css('display', 'block');
				$(".syBtnBox").prepend(selectedStations(stationsChecked));
				$(".selectList").show();
				if ($(".syBtnBox")[0].offsetHeight <= 120 && $(".syBtnBox")[0].offsetHeight >= 90) {
					$(".syDistanceBox").css('margin-bottom', 125);
				} else if ($(".syBtnBox")[0].offsetHeight > 120) {
					$(".syDistanceBox").css('margin-bottom', 165);
				} else if ($(".syBtnBox")[0].offsetHeight < 90) {
					if (isMobileBrowser()) {
						$(".syDistanceBox").css('margin-bottom', 70);
					} else {
						$(".syDistanceBox").css('margin-bottom', 0);
					}
				}
			} else {
				$("#commutemetrosubmitbtn").css('display', 'none');
				if (isMobileBrowser()) {
					$(".syDistanceBox").css('margin-bottom', 70);
					$(".syBtnBox").css('display', 'block');
				} else {
					$(".syDistanceBox").css('margin-bottom', 0);
					$(".syBtnBox").css('display', 'none');
				}
			}
		});

		$("body").on('click', '.syBackBtnBox strong', () => {
			$(".syDistanceBox").css('display', 'none');
			$(".syBackBtnBox").css('display', 'none');
			$(".syMetroRoute").css('display', 'block');
			$(".syHeadingBox").css('display', 'block');
			$(".sySearchBox").css('display', 'block');
			$(".selectList").remove();
			$('.syDistanceBox input[type="checkbox"]').prop('checked', false);
			$("#SearchLines").val('');
			if (isMobileBrowser()) {
				$(".syBtnBox").css('display', 'block');
			} else {
				$(".syBtnBox").css('display', 'none');
			}
			$("#commutemetrosubmitbtn").css('display', 'none');
			stationsChecked = [];
			if (isMobileBrowser()) {
				$(".syDistanceBox").css('margin-bottom', 70);
			} else {
				$(".syDistanceBox").css('margin-bottom', 0);
			}
		});

		$("body").on('click', '.selectList li .close', function () {
			const removeItem = { station: $(this).siblings().text().trim(), stationId: $(this).attr('Id') };
			const removeStation = $(this).siblings().text().trim();

			stationsChecked = stationsChecked.filter((item) => item.stationId !== removeItem.stationId);

			$('.syDistanceBox li').find('strong').filter(function () {
				return $(this).text().trim() === removeStation;
			}).closest('li')
				.find('input[type="checkbox"]')
				.prop('checked', false);

			$(this).parent().remove();

			$(".selectList").remove();

			if (stationsChecked.length > 0) {
				$(".syBtnBox").css('display', 'block');
				$("#commutemetrosubmitbtn").css('display', 'block');
				$(".syBtnBox").prepend(selectedStations(stationsChecked));
				$(".selectList").show();
				if ($(".syBtnBox")[0].offsetHeight <= 120 && $(".syBtnBox")[0].offsetHeight >= 90) {
					$(".syDistanceBox").css('margin-bottom', 125);
				} else if ($(".syBtnBox")[0].offsetHeight > 120) {
					$(".syDistanceBox").css('margin-bottom', 165);
				} else if ($(".syBtnBox")[0].offsetHeight < 90) {
					if (isMobileBrowser()) {
						$(".syDistanceBox").css('margin-bottom', 70);
					} else {
						$(".syDistanceBox").css('margin-bottom', 0);
					}
				}
			} else {
				$("#commutemetrosubmitbtn").css('display', 'none');
				if (isMobileBrowser()) {
					$(".syDistanceBox").css('margin-bottom', 70);
					$(".syBtnBox").css('display', 'block');
				} else {
					$(".syDistanceBox").css('margin-bottom', 0);
					$(".syBtnBox").css('display', 'none');
				}
			}
		});
	});
}

async function checkMetroCommuteButton(activeTabMetro) {
	const cityValNP = newdevcityid;
	const cityValRR = cityId.toString();
	if (activeTabMetro.toLowerCase().indexOf('newp') != -1) {
		tabCM = 'newProjects';
		cityIdCM = cityValNP || 0;
		desktopCommuteFlag = true;
	} else if (activeTabMetro.toLowerCase().indexOf('sale') != -1 || activeTabMetro.toLowerCase().indexOf('plot') != -1) {
		tabCM = 'resale';
		cityIdCM = cityValRR || 0;
		desktopCommuteFlag = true;
	} else if (activeTabMetro.toLowerCase().indexOf('rent') != -1) {
		tabCM = 'rental';
		cityIdCM = cityValRR || 0;
		desktopCommuteFlag = true;
	} else if (activeTabMetro.toLowerCase().indexOf('commercial') != -1) {
		tabCM = $(`.common${isIpadBrowser() ? '-mobile' : ''}-search .apply-filter[type='transaction'].active`).attr('value') ? "resale" : "rental";
		cityIdCM = cityValRR || 0;
		desktopCommuteFlag = true;
	} else {
		tabCM = '';
		cityIdCM = 0;
	}
	cityNameCM = cityName;
}
