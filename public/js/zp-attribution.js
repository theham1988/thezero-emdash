/*
 * Attribution capture for every page of the site.
 *
 * Reads the ad click parameters from the URL on landing, keeps them for the
 * browser session, and exposes window.zpAttr(key) so any form can attach them
 * to a lead even when the visitor browsed other pages before submitting.
 *
 * A new ad click (any tracked parameter in the URL) replaces the stored set.
 */
(function () {
	var KEYS = [
		"utm_source",
		"utm_medium",
		"utm_campaign",
		"utm_content",
		"utm_term",
		"gclid",
		"gbraid",
		"wbraid",
		"gad_source",
		"fbclid",
		"msclkid",
	];
	var STORE = "zp_attr";
	var params = new URLSearchParams(window.location.search);
	var fromUrl = {};
	var hasAny = false;
	for (var i = 0; i < KEYS.length; i++) {
		var v = params.get(KEYS[i]);
		if (v) {
			fromUrl[KEYS[i]] = v;
			hasAny = true;
		}
	}

	var stored = {};
	try {
		stored = JSON.parse(sessionStorage.getItem(STORE) || "{}") || {};
	} catch (e) {
		stored = {};
	}

	// The words the visitor searched for, when the search engine passes them on.
	// Google hides them for organic clicks; some other engines still send them.
	function searchTermFrom(referrer) {
		try {
			var q = new URL(referrer).searchParams;
			var names = ["q", "query", "text", "p", "wd", "keyword"];
			for (var n = 0; n < names.length; n++) {
				var t = q.get(names[n]);
				if (t && t.trim()) return t.trim().slice(0, 200);
			}
		} catch (e) {}
		return "";
	}

	if (hasAny) {
		fromUrl.landing_page = window.location.href;
		fromUrl.referrer = document.referrer || "";
		fromUrl.search_term = fromUrl.utm_term || searchTermFrom(document.referrer);
		stored = fromUrl;
	} else if (!stored.landing_page) {
		stored.landing_page = window.location.href;
		stored.referrer = document.referrer || "";
		stored.search_term = searchTermFrom(document.referrer);
	}

	try {
		sessionStorage.setItem(STORE, JSON.stringify(stored));
	} catch (e) {
		/* storage blocked: the current URL still works below */
	}

	window.zpAttr = function (key) {
		return params.get(key) || stored[key] || "";
	};
	window.zpAttrAll = function () {
		var out = {};
		for (var k in stored) out[k] = stored[k];
		for (var j = 0; j < KEYS.length; j++) {
			var cur = params.get(KEYS[j]);
			if (cur) out[KEYS[j]] = cur;
		}
		return out;
	};
})();
