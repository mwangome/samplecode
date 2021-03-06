/*
 * ux.ManagedIFrame for ExtJS Library 3.1+
 * Copyright(c) 2008-2009 Active Group, Inc.
 * licensing@theactivegroup.com
 * http://licensing.theactivegroup.com
 */
Ext.namespace("Ext.ux.plugin");
Ext
		.onReady(function() {
			var a = Ext.util.CSS;
			if (a) {
				a.getRule(".x-hide-nosize")
						|| a
								.createStyleSheet(".x-hide-nosize{height:0px!important;width:0px!important;border:none!important;zoom:1;}.x-hide-nosize * {height:0px!important;width:0px!important;border:none!important;zoom:1;}");
				a.refreshCache()
			}
		});
(function() {
	var g = Ext.Element, b = Ext.lib.Anim, a = g.prototype;
	var f = "visibility", d = "display", c = "hidden", i = "none";
	var e = {};
	e.El = {
		setDisplayed : function(k) {
			var j = this;
			j.visibilityCls ? (j[k !== false ? "removeClass" : "addClass"]
					(j.visibilityCls)) : a.setDisplayed.call(j, k);
			return j
		},
		isDisplayed : function() {
			return !(this.hasClass(this.visibilityCls) || this.isStyle(d, i))
		},
		fixDisplay : function() {
			var j = this;
			a.fixDisplay.call(j);
			j.visibilityCls && j.removeClass(j.visibilityCls)
		},
		isVisible : function(k) {
			var l = this.visible
					|| (!this.isStyle(f, c) && (this.visibilityCls ? !this
							.hasClass(this.visibilityCls) : !this.isStyle(d, i)));
			if (k !== true || !l) {
				return l
			}
			var m = this.dom.parentNode, j = /^body/i;
			while (m && !j.test(m.tagName)) {
				if (!Ext.fly(m, "_isVisible").isVisible()) {
					return false
				}
				m = m.parentNode
			}
			return true
		},
		isStyle : a.isStyle || function(j, k) {
			return this.getStyle(j) == k
		}
	};
	Ext.override(g.Flyweight, e.El);
	Ext.ux.plugin.VisibilityMode = function(k) {
		Ext.apply(this, k || {});
		var j = Ext.util.CSS;
		if (j && !Ext.isIE && this.fixMaximizedWindow !== false
				&& !Ext.ux.plugin.VisibilityMode.MaxWinFixed) {
			j.updateRule(".x-window-maximized-ct", "overflow", "");
			Ext.ux.plugin.VisibilityMode.MaxWinFixed = true
		}
	};
	Ext
			.extend(
					Ext.ux.plugin.VisibilityMode,
					Object,
					{
						bubble : true,
						fixMaximizedWindow : true,
						elements : null,
						visibilityCls : "x-hide-nosize",
						hideMode : "nosize",
						ptype : "uxvismode",
						init : function(n) {
							var k = this.hideMode || n.hideMode, m = this, j = Ext.Container.prototype.bubble, l = function() {
								var q = [ this.collapseEl, this.actionMode ]
										.concat(m.elements || []);
								Ext.each(q, function(r) {
									m.extend(this[r] || r)
								}, this);
								var p = {
									visFixed : true,
									animCollapse : false,
									animFloat : false,
									hideMode : k,
									defaults : this.defaults || {}
								};
								p.defaults.hideMode = k;
								Ext.apply(this, p);
								Ext.apply(this.initialConfig || {}, p)
							};
							n.on("render", function() {
								if (m.bubble !== false && this.ownerCt) {
									j.call(this.ownerCt, function() {
										this.visFixed
												|| this.on("afterlayout", l,
														this, {
															single : true
														})
									})
								}
								l.call(this)
							}, n, {
								single : true
							})
						},
						extend : function(j, k) {
							j && Ext.each( [].concat(j), function(l) {
								if (l && l.dom) {
									if ("visibilityCls" in l) {
										return
									}
									Ext.apply(l, e.El);
									l.visibilityCls = k || this.visibilityCls
								}
							}, this);
							return this
						}
					});
	Ext.preg && Ext.preg("uxvismode", Ext.ux.plugin.VisibilityMode);
	Ext.provide && Ext.provide("uxvismode")
})();
(function() {
	var J = Ext.Element, n, u = Ext.lib.Dom, al = Ext.lib.Anim, m = Ext.EventManager, aj = Ext.lib.Event, an = document, t = function() {
	}, ap = Object.prototype, aA = ap.toString, B = /^body/i, q = "[object HTMLDocument]";
	if (!Ext.elCache || parseInt(Ext.version.replace(/\./g, ""), 10) < 311) {
		alert("Ext Release " + Ext.version + " is not supported")
	}
	Ext._documents = {};
	Ext._documents[Ext.id(document, "_doc")] = Ext.elCache;
	var T = u.resolveDocumentCache = function(E, aF) {
		Ext._documents[Ext.id(document, "_doc")] = Ext.elCache;
		var aE = e(E), aG = Ext.isDocument(aE) ? Ext.id(aE) : aF, A = Ext._documents[aG]
				|| null;
		return A || (aG ? Ext._documents[aG] = {} : null)
	}, aD = u.clearDocumentCache = function(A) {
		delete Ext._documents[A]
	};
	J.addMethods || (J.addMethods = function(A) {
		Ext.apply(J.prototype, A || {})
	});
	Ext.removeNode = function(aH) {
		var aG = aH ? aH.dom || aH : null, aE, aF, A = T(aG), E;
		if (aG && (aF = A[aG.id]) && (aE = aF.el)) {
			if (aE.dom) {
				Ext.enableNestedListenerRemoval ? m.purgeElement(aE.dom, true)
						: m.removeAll(aE.dom)
			}
			delete A[aG.id];
			delete aE.dom;
			delete aE._context;
			aE = null
		}
		if (aG && !aG.navigator && !Ext.isDocument(aG) && !B.test(aG.tagName)) {
			(E = aG.parentElement || aG.parentNode) && E.removeChild(aG)
		}
		aG = E = null
	};
	var f = function(aI, aG) {
		var aH = typeof aI === "function" ? aI : function aF() {
		};
		var aE = aH._ovl;
		if (!aE) {
			aE = {
				base : aH
			};
			aE[aH.length || 0] = aH;
			aH = function aF() {
				var aL = arguments.callee._ovl;
				var aK = aL[arguments.length] || aL.base;
				return aK && aK != arguments.callee ? aK.apply(this, arguments)
						: undefined
			}
		}
		var aJ = [].concat(aG);
		for ( var E = 0, A = aJ.length; E < A; ++E) {
			aE[aJ[E].length] = aJ[E]
		}
		aH._ovl = aE;
		var aF = null;
		return aH
	};
	Ext
			.applyIf(
					Ext,
					{
						overload : f(f, [ function(A) {
							return f(null, A)
						}, function(aE, E, A) {
							return aE[E] = f(aE[E], A)
						} ]),
						isArray : function(A) {
							return !!A && aA.apply(A) == "[object Array]"
						},
						isObject : function(A) {
							return !!A && typeof A == "object"
						},
						isDocument : function(E, A) {
							var aG = E ? E.dom || E : null;
							var aF = aG
									&& ((aA.apply(aG) == q) || (aG && aG.nodeType == 9));
							if (aF && A) {
								try {
									aF = !!aG.location
								} catch (aE) {
									return false
								}
							}
							return aF
						},
						isWindow : function(A) {
							var E = A ? A.dom || A : null;
							return E ? !!E.navigator
									|| aA.apply(E) == "[object Window]" : false
						},
						isIterable : function(A) {
							if (Ext.isArray(A) || A.callee) {
								return true
							}
							if (/NodeList|HTMLCollection/.test(aA.call(A))) {
								return true
							}
							return ((typeof A.nextNode != "undefined" || A.item) && Ext
									.isNumber(A.length))
						},
						isElement : function(A) {
							return A && Ext.type(A) == "element"
						},
						isEvent : function(A) {
							return aA.apply(A) == "[object Event]"
									|| (Ext.isObject(A)
											&& !Ext.type(o.constructor) && (window.event
											&& A.clientX && A.clientX == window.event.clientX))
						},
						isFunction : function(A) {
							return !!A && typeof A == "function"
						},
						isEventSupported : function(aF, aG) {
							var aE = {
								select : "input",
								change : "input",
								submit : "form",
								reset : "form",
								load : "img",
								error : "img",
								abort : "img"
							}, A = {}, aH = /^on/i, E = function(aK, aJ) {
								var aI = Ext.getDom(aJ);
								return (aI ? (Ext.isElement(aI)
										|| Ext.isDocument(aI) ? aI.nodeName
										.toLowerCase() : aJ.self ? "#window"
										: aJ || "#object") : aJ || "div")
										+ ":" + aK
							};
							return function(aM, aO) {
								aM = (aM || "").replace(aH, "");
								var aN, aL = false;
								var aJ = "on" + aM;
								var aI = (aO ? aO : aE[aM]) || "div";
								var aK = E(aM, aI);
								if (aK in A) {
									return A[aK]
								}
								aN = Ext.isString(aI) ? an.createElement(aI)
										: aO;
								aL = (!!aN && (aJ in aN));
								aL
										|| (aL = window.Event
												&& !!(String(aM).toUpperCase() in window.Event));
								if (!aL && aN) {
									aN.setAttribute
											&& aN.setAttribute(aJ, "return;");
									aL = Ext.isFunction(aN[aJ])
								}
								A[aK] = aL;
								aN = null;
								return aL
							}
						}()
					});
	var ao = function(A) {
		return J;
		return J[(A.tagName || "-").toUpperCase()] || J
	};
	var H;
	function ai(A, E) {
		if (!H) {
			H = new Ext.Element.Flyweight()
		}
		H.dom = Ext.getDom(A, null, E);
		return H
	}
	Ext.apply(Ext, {
		get : J.get = function(aF, aK) {
			if (!aF) {
				return null
			}
			var aJ = Ext.isDocument(aF);
			Ext.isDocument(aK) || (aK = an);
			var aI, aH, E, A = T(aK);
			if (typeof aF == "string") {
				aH = Ext.getDom(aF, null, aK);
				if (!aH) {
					return null
				}
				if (A[aF] && A[aF].el) {
					aI = A[aF].el;
					aI.dom = aH
				} else {
					aI = J.addToCache(new (ao(aH))(aH, null, aK))
				}
				return aI
			} else {
				if (aJ) {
					if (!Ext.isDocument(aF, true)) {
						return false
					}
					A = T(aF);
					if (A[Ext.id(aF)] && A[aF.id].el) {
						return A[aF.id].el
					}
					var aG = function() {
					};
					aG.prototype = J.prototype;
					var aE = new aG();
					aE.dom = aF;
					aE.id = Ext.id(aF, "_doc");
					aE._isDoc = true;
					J.addToCache(aE, null, A);
					return aE
				} else {
					if (aF instanceof J) {
						if (aF.dom) {
							aF.id = Ext.id(aF.dom)
						} else {
							aF.dom = aF.id ? Ext.getDom(aF.id, true) : null
						}
						if (aF.dom) {
							A = T(aF);
							(A[aF.id] || (A[aF.id] = {
								data : {},
								events : {}
							})).el = aF
						}
						return aF
					} else {
						if (aF.tagName || Ext.isWindow(aF)) {
							A = T(aF);
							E = Ext.id(aF);
							if (A[E] && (aI = A[E].el)) {
								aI.dom = aF
							} else {
								aI = J.addToCache(new (ao(aF))(aF, null, aK),
										null, A)
							}
							return aI
						} else {
							if (aF.isComposite) {
								return aF
							} else {
								if (Ext.isArray(aF)) {
									return Ext.get(aK, aK).select(aF)
								}
							}
						}
					}
				}
			}
			return null
		},
		getDom : function(E, A, aG) {
			var aF = aG || an;
			if (!E || !aF) {
				return null
			}
			if (E.dom) {
				return E.dom
			} else {
				if (Ext.isString(E)) {
					var aE = aF.getElementById(E);
					if (aE && Ext.isIE && A) {
						if (E == aE.getAttribute("id")) {
							return aE
						} else {
							return null
						}
					}
					return aE
				} else {
					return E
				}
			}
		},
		getBody : function(E) {
			var A = u.getDocument(E) || an;
			return Ext.get(A.body || A.documentElement)
		},
		getDoc : Ext.overload( [ Ext.getDoc, function(A) {
			return Ext.get(A, A)
		} ])
	});
	J.data = function(E, A, aE) {
		E = J.get(E);
		if (!E) {
			return null
		}
		var aF = T(E)[E.id].data;
		if (arguments.length == 2) {
			return aF[A]
		} else {
			return (aF[A] = aE)
		}
	};
	J.addToCache = function(E, aG, A) {
		aG = aG || Ext.id(E);
		var aF = A || T(E);
		aF[aG] = {
			el : E.dom ? E : Ext.get(E),
			data : {},
			events : {}
		};
		var aE = aF[aG].el.dom;
		(aE.getElementById || aE.navigator) && (aF[aG].skipGC = true);
		return aF[aG].el
	};
	J.removeFromCache = function(E, A) {
		if (E && E.id) {
			var aE = A || T(E);
			delete aE[E.id]
		}
	};
	J.OFFSETS = 3;
	J.ASCLASS = 4;
	J.visibilityCls = "x-hide-nosize";
	var ar = {}, L = /(-[a-z])/gi, G = function(A, E) {
		return E.charAt(1).toUpperCase()
	}, i = /alpha\(opacity=(.*)\)/i, l = /^\s+|\s+$/g, ay = /marginRight/, C = Ext.isIE ? "styleFloat"
			: "cssFloat", at = an.defaultView, ac = "visibilityMode", av = "asclass", M = "originalDisplay", ad = "padding", Q = "margin", aw = "border", c = "-left", j = "-right", p = "-top", au = "-bottom", P = "-width", az = Math, Y = "opacity", X = "visibility", K = "display", ag = "offsets", z = "nosize", av = "asclass", ae = "hidden", Z = "none", W = "isVisible", v = "isClipped", d = "overflow", S = "overflow-x", R = "overflow-y", D = "originalClip", O = "x-masked", F = "x-masked-relative", ah = {
		l : aw + c + P,
		r : aw + j + P,
		t : aw + p + P,
		b : aw + au + P
	}, am = {
		l : ad + c,
		r : ad + j,
		t : ad + p,
		b : ad + au
	}, r = {
		l : Q + c,
		r : Q + j,
		t : Q + p,
		b : Q + au
	}, I = J.data, aB = Ext.getDom, s = Ext.get, af = Ext.DomHelper, aa = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/, aC = Ext.util.CSS, ak = function(
			E) {
		var A = I(E, M);
		if (A === undefined) {
			I(E, M, A = "")
		}
		return A
	}, k = function(E) {
		var A = I(E, ac);
		if (A === undefined) {
			I(E, ac, A = J.prototype.visibilityMode)
		}
		return A
	};
	function aq(A) {
		return ar[A] || (ar[A] = A == "float" ? C : A.replace(L, G))
	}
	J
			.addMethods( {
				getDocument : function() {
					return this._context || (this._context = e(this))
				},
				remove : function(E, A) {
					var aE = this.dom;
					if (aE) {
						Ext.removeNode(aE);
						delete this._context;
						delete this.dom
					}
				},
				appendChild : function(A, E) {
					return s(A, E || this.getDocument()).appendTo(this)
				},
				appendTo : function(A, E) {
					aB(A, false, E || this.getDocument()).appendChild(this.dom);
					return this
				},
				insertBefore : function(A, E) {
					(A = aB(A, false, E || this.getDocument())).parentNode
							.insertBefore(this.dom, A);
					return this
				},
				insertAfter : function(A, E) {
					(A = aB(A, false, E || this.getDocument())).parentNode
							.insertBefore(this.dom, A.nextSibling);
					return this
				},
				insertFirst : function(E, A) {
					E = E || {};
					if (E.nodeType || E.dom || typeof E == "string") {
						E = aB(E);
						this.dom.insertBefore(E, this.dom.firstChild);
						return !A ? s(E) : E
					} else {
						return this.createChild(E, this.dom.firstChild, A)
					}
				},
				replace : function(A, E) {
					A = s(A, E || this.getDocument());
					this.insertBefore(A);
					A.remove();
					return this
				},
				replaceWith : function(A, aE) {
					var E = this;
					if (A.nodeType || A.dom || typeof A == "string") {
						A = aB(A, false, aE || E.getDocument());
						E.dom.parentNode.insertBefore(A, E.dom)
					} else {
						A = af.insertBefore(E.dom, A)
					}
					var aF = T(E);
					Ext.removeNode(E.dom);
					E.id = Ext.id(E.dom = A);
					J.addToCache(E.isFlyweight ? new (ao(E.dom))(E.dom, null,
							aF) : E);
					return E
				},
				insertHtml : function(E, aE, A) {
					var aF = af.insertHtml(E, this.dom, aE);
					return A ? Ext.get(aF, e(aF)) : aF
				},
				isVisible : function(A) {
					var E = this, aG = E.dom, aE = aG.parentNode, aF = I(aG, W);
					if (typeof aF != "boolean") {
						aF = !E.hasClass(E.visibilityCls || J.visibilityCls)
								&& !E.isStyle(X, ae) && !E.isStyle(K, Z);
						I(aG, W, aF)
					}
					if (A !== true || !aF) {
						return aF
					}
					while (aE && !B.test(aE.tagName)) {
						if (!Ext.fly(aE, "_isVisible").isVisible()) {
							return false
						}
						aE = aE.parentNode
					}
					return true
				},
				setVisible : function(aG, A) {
					var aE = this, aF = aE.dom, E = k(aF);
					if (typeof A == "string") {
						switch (A) {
						case K:
							E = J.DISPLAY;
							break;
						case X:
							E = J.VISIBILITY;
							break;
						case ag:
							E = J.OFFSETS;
							break;
						case z:
						case av:
							E = J.ASCLASS;
							break
						}
						aE.setVisibilityMode(E);
						A = false
					}
					if (!A || !aE.anim) {
						if (E == J.ASCLASS) {
							aE[aG ? "removeClass" : "addClass"]
									(aE.visibilityCls || J.visibilityCls)
						} else {
							if (E == J.DISPLAY) {
								return aE.setDisplayed(aG)
							} else {
								if (E == J.OFFSETS) {
									if (!aG) {
										aE.hideModeStyles = {
											position : aE.getStyle("position"),
											top : aE.getStyle("top"),
											left : aE.getStyle("left")
										};
										aE.applyStyles( {
											position : "absolute",
											top : "-10000px",
											left : "-10000px"
										})
									} else {
										aE.applyStyles(aE.hideModeStyles || {
											position : "",
											top : "",
											left : ""
										});
										delete aE.hideModeStyles
									}
								} else {
									aE.fixDisplay();
									aF.style.visibility = aG ? "visible" : ae
								}
							}
						}
					} else {
						if (aG) {
							aE.setOpacity(0.01);
							aE.setVisible(true)
						}
						aE.anim( {
							opacity : {
								to : (aG ? 1 : 0)
							}
						}, aE.preanim(arguments, 1), null, 0.35, "easeIn",
								function() {
									aG || aE.setVisible(false).setOpacity(1)
								})
					}
					I(aF, W, aG);
					return aE
				},
				hasMetrics : function() {
					var A = this;
					return A.isVisible() || (k(A.dom) == J.VISIBILITY)
				},
				setDisplayed : function(E) {
					var aE = this.dom, A = k(aE);
					if (typeof E == "boolean") {
						if (A == J.ASCLASS) {
							return this.setVisible(E)
						}
						I(this.dom, W, E);
						E = E ? ak(aE) : Z
					}
					this.setStyle(K, E);
					return this
				},
				enableDisplayMode : function(A) {
					this.setVisibilityMode(J.DISPLAY);
					if (!Ext.isEmpty(A)) {
						I(this.dom, M, A)
					}
					return this
				},
				scrollIntoView : function(aE, aH) {
					var aM = this.getDocument(), aN = Ext.getDom(aE, null, aM)
							|| Ext.getBody(aM).dom, aG = this.dom, aF = this
							.getOffsetsTo(aN), aJ = aF[0] + aN.scrollLeft, aQ = aF[1]
							+ aN.scrollTop, aO = aQ + aG.offsetHeight, E = aJ
							+ aG.offsetWidth, A = aN.clientHeight, aK = parseInt(
							aN.scrollTop, 10), aP = parseInt(aN.scrollLeft, 10), aI = aK
							+ A, aL = aP + aN.clientWidth;
					if (aG.offsetHeight > A || aQ < aK) {
						aN.scrollTop = aQ
					} else {
						if (aO > aI) {
							aN.scrollTop = aO - A
						}
					}
					aN.scrollTop = aN.scrollTop;
					if (aH !== false) {
						if (aG.offsetWidth > aN.clientWidth || aJ < aP) {
							aN.scrollLeft = aJ
						} else {
							if (E > aL) {
								aN.scrollLeft = E - aN.clientWidth
							}
						}
						aN.scrollLeft = aN.scrollLeft
					}
					return this
				},
				contains : function(A) {
					try {
						return !A ? false : u.isAncestor(this.dom,
								A.dom ? A.dom : A)
					} catch (E) {
						return false
					}
				},
				getScroll : function() {
					var aI = this.dom, aH = this.getDocument(), A = aH.body, aE = aH.documentElement, E, aG, aF;
					if (Ext.isDocument(aI) || aI == A) {
						if (Ext.isIE && u.docIsStrict(aH)) {
							E = aE.scrollLeft;
							aG = aE.scrollTop
						} else {
							E = window.pageXOffset;
							aG = window.pageYOffset
						}
						aF = {
							left : E || (A ? A.scrollLeft : 0),
							top : aG || (A ? A.scrollTop : 0)
						}
					} else {
						aF = {
							left : aI.scrollLeft,
							top : aI.scrollTop
						}
					}
					return aF
				},
				getStyle : function() {
					var A = at && at.getComputedStyle ? function E(aL) {
						var aI = !this._isDoc ? this.dom : null, aE, aH, aF, aJ, aK = Ext.isWebKit, aJ, aG;
						if (!aI || !aI.style) {
							return null
						}
						aG = aI.style;
						aL = aq(aL);
						aH = at.getComputedStyle(aI, null);
						aF = (aH) ? aH[aL] : null;
						if (aK) {
							if (aF && ay.test(aL) && aG.position != "absolute"
									&& aF != "0px") {
								aJ = aG.display;
								aG.display = "inline-block";
								aF = at.getComputedStyle(aI, null)[aL];
								aG.display = aJ
							} else {
								if (aF == "rgba(0, 0, 0, 0)") {
									aF = "transparent"
								}
							}
						}
						return aF || aG[aL]
					}
							: function E(aJ) {
								var aH = !this._isDoc ? this.dom : null, aE, aG, aF;
								if (!aH || !aH.style) {
									return null
								}
								aF = aH.style;
								if (aJ == Y) {
									if (aF.filter.match) {
										if (aE = aF.filter.match(i)) {
											var aI = parseFloat(aE[1]);
											if (!isNaN(aI)) {
												return aI ? aI / 100 : 0
											}
										}
									}
									return 1
								}
								aJ = aq(aJ);
								return ((aG = aH.currentStyle) ? aG[aJ] : null)
										|| aH.style[aJ]
							};
					var E = null;
					return A
				}(),
				setStyle : function(aF, aE) {
					if (this._isDoc || Ext.isDocument(this.dom)) {
						return this
					}
					var A, E;
					if (typeof aF != "object") {
						A = {};
						A[aF] = aE;
						aF = A
					}
					for (E in aF) {
						if (aF.hasOwnProperty(E)) {
							aE = aF[E];
							E == Y ? this.setOpacity(aE)
									: this.dom.style[aq(E)] = aE
						}
					}
					return this
				},
				center : function(A) {
					return this.alignTo(A || this.getDocument(), "c-c")
				},
				mask : function(E, aH) {
					var aJ = this, aF = aJ.dom, aI = Ext.DomHelper, aG = "ext-el-mask-msg", A, aK;
					if (aJ.getStyle("position") == "static") {
						aJ.addClass(F)
					}
					if ((A = I(aF, "maskMsg"))) {
						A.remove()
					}
					if ((A = I(aF, "mask"))) {
						A.remove()
					}
					aK = aI.append(aF, {
						cls : "ext-el-mask"
					}, true);
					I(aF, "mask", aK);
					aJ.addClass(O);
					aK.setDisplayed(true);
					if (typeof E == "string") {
						var aE = aI.append(aF, {
							cls : aG,
							cn : {
								tag : "div"
							}
						}, true);
						I(aF, "maskMsg", aE);
						aE.dom.className = aH ? aG + " " + aH : aG;
						aE.dom.firstChild.innerHTML = E;
						aE.setDisplayed(true);
						aE.center(aJ)
					}
					if (Ext.isIE && !(Ext.isIE7 && Ext.isStrict)
							&& aJ.getStyle("height") == "auto") {
						aK.setSize(undefined, aJ.getHeight())
					}
					return aK
				},
				unmask : function() {
					var aE = this, aF = aE.dom, A = I(aF, "mask"), E = I(aF,
							"maskMsg");
					if (A) {
						if (E) {
							E.remove();
							I(aF, "maskMsg", undefined)
						}
						A.remove();
						I(aF, "mask", undefined)
					}
					aE.removeClass( [ O, F ])
				},
				isMasked : function() {
					var A = I(this.dom, "mask");
					return A && A.isVisible()
				},
				getCenterXY : function() {
					return this.getAlignToXY(this.getDocument(), "c-c")
				},
				getAnchorXY : function(aG, aL, aQ) {
					aG = (aG || "tl").toLowerCase();
					aQ = aQ || {};
					var aK = this, aN = this.getDocument(), E = aK.dom == aN.body
							|| aK.dom == aN, aO = aQ.width || E ? u
							.getViewWidth(false, aN) : aK.getWidth(), aI = aQ.height
							|| E ? u.getViewHeight(false, aN) : aK.getHeight(), aP, A = Math.round, aE = aK
							.getXY(), aM = aK.getScroll(), aJ = E ? aM.left
							: !aL ? aE[0] : 0, aH = E ? aM.top : !aL ? aE[1]
							: 0, aF = {
						c : [ A(aO * 0.5), A(aI * 0.5) ],
						t : [ A(aO * 0.5), 0 ],
						l : [ 0, A(aI * 0.5) ],
						r : [ aO, A(aI * 0.5) ],
						b : [ A(aO * 0.5), aI ],
						tl : [ 0, 0 ],
						bl : [ 0, aI ],
						br : [ aO, aI ],
						tr : [ aO, 0 ]
					};
					aP = aF[aG];
					return [ aP[0] + aJ, aP[1] + aH ]
				},
				anchorTo : function(E, aH, aE, A, aJ, aK) {
					var aI = this, aG = aI.dom;
					function aF() {
						ai(aG).alignTo(E, aH, aE, A);
						Ext.callback(aK, ai(aG))
					}
					Ext.EventManager.onWindowResize(aF, aI);
					if (!Ext.isEmpty(aJ)) {
						Ext.EventManager.on(window, "scroll", aF, aI, {
							buffer : !isNaN(aJ) ? aJ : 50
						})
					}
					aF.call(aI);
					return aI
				},
				getScroll : function() {
					var aI = this.dom, aH = this.getDocument(), A = aH.body, aE = aH.documentElement, E, aG, aF;
					if (aI == aH || aI == A) {
						if (Ext.isIE && u.docIsStrict(aH)) {
							E = aE.scrollLeft;
							aG = aE.scrollTop
						} else {
							E = window.pageXOffset;
							aG = window.pageYOffset
						}
						aF = {
							left : E || (A ? A.scrollLeft : 0),
							top : aG || (A ? A.scrollTop : 0)
						}
					} else {
						aF = {
							left : aI.scrollLeft,
							top : aI.scrollTop
						}
					}
					return aF
				},
				getAlignToXY : function(aF, aR, aS) {
					var a6;
					aF = Ext.get(aF, a6 = this.getDocument());
					if (!aF || !aF.dom) {
						throw "Element.getAlignToXY with an element that doesn't exist"
					}
					aS = aS || [ 0, 0 ];
					aR = (aR == "?" ? "tl-bl?"
							: (!/-/.test(aR) && aR != "" ? "tl-" + aR : aR
									|| "tl-bl")).toLowerCase();
					var a3 = this, aY = a3.dom, a5, a4, aK, aJ, aM, aW, aP, aN = u
							.getViewWidth(false, a6) - 10, aX = u
							.getViewHeight(false, a6) - 10, E, aG, aH, aI, aO, aQ, a0 = a6.documentElement, aL = a6.body, aV = (a0.scrollLeft
							|| aL.scrollLeft || 0) + 5, aU = (a0.scrollTop
							|| aL.scrollTop || 0) + 5, aZ = false, aE = "", A = "", aT = aR
							.match(/^([a-z]+)-([a-z]+)(\?)?$/);
					if (!aT) {
						throw "Element.getAlignToXY with an invalid alignment "
								+ aR
					}
					aE = aT[1];
					A = aT[2];
					aZ = !!aT[3];
					a5 = a3.getAnchorXY(aE, true);
					a4 = aF.getAnchorXY(A, false);
					aK = a4[0] - a5[0] + aS[0];
					aJ = a4[1] - a5[1] + aS[1];
					if (aZ) {
						aM = a3.getWidth();
						aW = a3.getHeight();
						aP = aF.getRegion();
						E = aE.charAt(0);
						aG = aE.charAt(aE.length - 1);
						aH = A.charAt(0);
						aI = A.charAt(A.length - 1);
						aO = ((E == "t" && aH == "b") || (E == "b" && aH == "t"));
						aQ = ((aG == "r" && aI == "l") || (aG == "l" && aI == "r"));
						if (aK + aM > aN + aV) {
							aK = aQ ? aP.left - aM : aN + aV - aM
						}
						if (aK < aV) {
							aK = aQ ? aP.right : aV
						}
						if (aJ + aW > aX + aU) {
							aJ = aO ? aP.top - aW : aX + aU - aW
						}
						if (aJ < aU) {
							aJ = aO ? aP.bottom : aU
						}
					}
					return [ aK, aJ ]
				},
				adjustForConstraints : function(aE, A, E) {
					return this.getConstrainToXY(A || this.getDocument(),
							false, E, aE)
							|| aE
				},
				getConstrainToXY : function(E, A, aE, aG) {
					var aF = {
						top : 0,
						left : 0,
						bottom : 0,
						right : 0
					};
					return function(aI, aQ, aJ, aH) {
						var aS = this.getDocument();
						aI = Ext.get(aI, aS);
						aJ = aJ ? Ext.applyIf(aJ, aF) : aF;
						var aR, aK, aP = 0, aN = 0;
						if (aI.dom == aS.body || aI.dom == aS) {
							aR = u.getViewWidth(false, aS);
							aK = u.getViewHeight(false, aS)
						} else {
							aR = aI.dom.clientWidth;
							aK = aI.dom.clientHeight;
							if (!aQ) {
								var aL = aI.getXY();
								aP = aL[0];
								aN = aL[1]
							}
						}
						var aV = aI.getScroll();
						aP += aJ.left + aV.left;
						aN += aJ.top + aV.top;
						aR -= aJ.right;
						aK -= aJ.bottom;
						var aU = aP + aR, aM = aN + aK, aT = aH
								|| (!aQ ? this.getXY() : [ this.getLeft(true),
										this.getTop(true) ]);
						x = aT[0], y = aT[1], offset = this
								.getConstrainOffset(), w = this.dom.offsetWidth
								+ offset, h = this.dom.offsetHeight + offset;
						var aO = false;
						if ((x + w) > aU) {
							x = aU - w;
							aO = true
						}
						if ((y + h) > aM) {
							y = aM - h;
							aO = true
						}
						if (x < aP) {
							x = aP;
							aO = true
						}
						if (y < aN) {
							y = aN;
							aO = true
						}
						return aO ? [ x, y ] : false
					}
				}(),
				getConstrainOffset : function() {
					return 0
				},
				getCenterXY : function() {
					return this.getAlignToXY(Ext.getBody(this.getDocument()),
							"c-c")
				},
				center : function(A) {
					return this.alignTo(A || Ext.getBody(this.getDocument()),
							"c-c")
				},
				findParent : function(aJ, aI, E) {
					var aG = this.dom, aF = this.getDocument(), A = aF.body, aH = 0, aE;
					if (Ext.isGecko && aA.call(aG) == "[object XULElement]") {
						return null
					}
					aI = aI || 50;
					if (isNaN(aI)) {
						aE = Ext.getDom(aI, null, aF);
						aI = Number.MAX_VALUE
					}
					while (aG && aG.nodeType == 1 && aH < aI && aG != A
							&& aG != aE) {
						if (Ext.DomQuery.is(aG, aJ)) {
							return E ? Ext.get(aG, aF) : aG
						}
						aH++;
						aG = aG.parentNode
					}
					return null
				},
				clip : function() {
					var A = this, E = A.dom;
					if (!I(E, v)) {
						I(E, v, true);
						I(E, D, {
							o : A.getStyle(d),
							x : A.getStyle(S),
							y : A.getStyle(R)
						});
						A.setStyle(d, ae);
						A.setStyle(S, ae);
						A.setStyle(R, ae)
					}
					return A
				},
				unclip : function() {
					var A = this, aE = A.dom;
					if (I(aE, v)) {
						I(aE, v, false);
						var E = I(aE, D);
						if (E.o) {
							A.setStyle(d, E.o)
						}
						if (E.x) {
							A.setStyle(S, E.x)
						}
						if (E.y) {
							A.setStyle(R, E.y)
						}
					}
					return A
				},
				getViewSize : function() {
					var aE = this.getDocument(), aF = this.dom, A = (aF == aE || aF == aE.body);
					if (A) {
						var E = Ext.lib.Dom;
						return {
							width : E.getViewWidth(),
							height : E.getViewHeight()
						}
					} else {
						return {
							width : aF.clientWidth,
							height : aF.clientHeight
						}
					}
				},
				getStyleSize : function() {
					var aG = this, A, aF, aI = this.getDocument(), aJ = this.dom, E = (aJ == aI || aJ == aI.body), aE = aJ.style;
					if (E) {
						var aH = Ext.lib.Dom;
						return {
							width : aH.getViewWidth(),
							height : aH.getViewHeight()
						}
					}
					if (aE.width && aE.width != "auto") {
						A = parseFloat(aE.width);
						if (aG.isBorderBox()) {
							A -= aG.getFrameWidth("lr")
						}
					}
					if (aE.height && aE.height != "auto") {
						aF = parseFloat(aE.height);
						if (aG.isBorderBox()) {
							aF -= aG.getFrameWidth("tb")
						}
					}
					return {
						width : A || aG.getWidth(true),
						height : aF || aG.getHeight(true)
					}
				}
			});
	Ext
			.apply(
					u,
					{
						getDocument : function(aE, aF) {
							var aG = null;
							try {
								aG = Ext.getDom(aE, null, null)
							} catch (E) {
							}
							var A = Ext.isDocument(aG);
							if (A) {
								if (aF) {
									return Ext.isDocument(aG, aF) ? aG : null
								}
								return aG
							}
							return aG ? aG.ownerDocument || aG.document : null
						},
						docIsStrict : function(A) {
							return (Ext.isDocument(A) ? A : this.getDocument(A)).compatMode == "CSS1Compat"
						},
						getViewWidth : Ext.overload( [
								u.getViewWidth || function(A) {
								},
								function() {
									return this.getViewWidth(false)
								},
								function(A, E) {
									return A ? this.getDocumentWidth(E) : this
											.getViewportWidth(E)
								} ]),
						getViewHeight : Ext.overload( [
								u.getViewHeight || function(A) {
								},
								function() {
									return this.getViewHeight(false)
								},
								function(A, E) {
									return A ? this.getDocumentHeight(E) : this
											.getViewportHeight(E)
								} ]),
						getDocumentHeight : Ext
								.overload( [
										u.getDocumentHeight || t,
										function(A) {
											if (A = this.getDocument(A)) {
												return Math
														.max(
																!this
																		.docIsStrict(A) ? A.body.scrollHeight
																		: A.documentElement.scrollHeight,
																this
																		.getViewportHeight(A))
											}
											return undefined
										} ]),
						getDocumentWidth : Ext
								.overload( [
										u.getDocumentWidth || t,
										function(A) {
											if (A = this.getDocument(A)) {
												return Math
														.max(
																!this
																		.docIsStrict(A) ? A.body.scrollWidth
																		: A.documentElement.scrollWidth,
																this
																		.getViewportWidth(A))
											}
											return undefined
										} ]),
						getViewportHeight : Ext
								.overload( [
										u.getViewportHeight || t,
										function(A) {
											if (A = this.getDocument(A)) {
												if (Ext.isIE) {
													return this.docIsStrict(A) ? A.documentElement.clientHeight
															: A.body.clientHeight
												} else {
													return A.defaultView.innerHeight
												}
											}
											return undefined
										} ]),
						getViewportWidth : Ext
								.overload( [
										u.getViewportWidth || t,
										function(A) {
											if (A = this.getDocument(A)) {
												return !this.docIsStrict(A)
														&& !Ext.isOpera ? A.body.clientWidth
														: Ext.isIE ? A.documentElement.clientWidth
																: A.defaultView.innerWidth
											}
											return undefined
										} ]),
						getXY : Ext
								.overload( [
										u.getXY || t,
										function(A, aF) {
											if (typeof A == "string") {
												A = Ext.getDom(A, null, aF);
												var aE = this.getDocument(A), E = aE ? (aE.body || aE.documentElement)
														: null;
												if (!A || !E || A == E) {
													return [ 0, 0 ]
												}
											}
											return this.getXY(A)
										} ])
					});
	var e = u.getDocument, N = J._flyweights;
	Ext.fly = J.fly = function(aE, A, aF) {
		var E = null;
		A = A || "_global";
		if (aE = Ext.getDom(aE, null, aF)) {
			(E = N[A] = (N[A] || new J.Flyweight())).dom = aE;
			Ext.isDocument(aE) && (E._isDoc = true)
		}
		return E
	};
	var ax = function() {
	};
	ax.prototype = J.prototype;
	J.Flyweight = function(A) {
		this.dom = A
	};
	J.Flyweight.prototype = new ax();
	J.Flyweight.prototype.isFlyweight = true;
	function b(aF, aH, aK, aG, aE, aM) {
		aF = Ext.getDom(aF);
		if (!aF) {
			return
		}
		var E = Ext.id(aF), A = T(aF);
		A[E] || J.addToCache(aF, E, A);
		var aL = A[E].events || {}, aI;
		aI = aj.on(aF, aH, aE);
		aL[aH] = aL[aH] || [];
		aL[aH].push( [ aK, aE, aM, aI, aG ]);
		if (aF.addEventListener && aH == "mousewheel") {
			var aJ = [ "DOMMouseScroll", aE, false ];
			aF.addEventListener.apply(aF, aJ);
			Ext.EventManager.addListener(window, "beforeunload", function() {
				aF.removeEventListener.apply(aF, aJ)
			})
		}
		if (aH == "mousedown" && an == aF) {
			Ext.EventManager.stoppedMouseDownEvent.addListener(aE)
		}
	}
	function g(A, E) {
		return function() {
			var aE = Ext.toArray(arguments);
			if (E.target == Ext.EventObject.setEvent(aE[0]).target) {
				A.apply(this, aE)
			}
		}
	}
	function ab(E, aE, A) {
		return function(aF) {
			A.delay(aE.buffer, E, null, [ new Ext.EventObjectImpl(aF) ])
		}
	}
	function V(aG, aF, A, aE, E) {
		return function(aH) {
			Ext.EventManager.removeListener(aF, A, aE, E);
			aG(aH)
		}
	}
	function a(E, aE, A) {
		return function(aG) {
			var aF = new Ext.util.DelayedTask(E);
			(A.tasks || (A.tasks = [])).push(aF);
			aF.delay(aE.delay || 10, E, null, [ new Ext.EventObjectImpl(aG) ])
		}
	}
	function U(aH, aG, A, aJ, aK) {
		var E = !Ext.isObject(A) ? {} : A, aE = Ext.getDom(aH), aF;
		aJ = aJ || E.fn;
		aK = aK || E.scope;
		if (!aE) {
			throw 'Error listening for "' + aG + '". Element "' + aH
					+ "\" doesn't exist."
		}
		function aI(aM) {
			if (!window.Ext) {
				return
			}
			aM = Ext.EventObject.setEvent(aM);
			var aL;
			if (E.delegate) {
				if (!(aL = aM.getTarget(E.delegate, aE))) {
					return
				}
			} else {
				aL = aM.target
			}
			if (E.stopEvent) {
				aM.stopEvent()
			}
			if (E.preventDefault) {
				aM.preventDefault()
			}
			if (E.stopPropagation) {
				aM.stopPropagation()
			}
			if (E.normalized) {
				aM = aM.browserEvent
			}
			aJ.call(aK || aE, aM, aL, E)
		}
		if (E.target) {
			aI = g(aI, E)
		}
		if (E.delay) {
			aI = a(aI, E, aJ)
		}
		if (E.single) {
			aI = V(aI, aE, aG, aJ, aK)
		}
		if (E.buffer) {
			aF = new Ext.util.DelayedTask(aI);
			aI = ab(aI, E, aF)
		}
		b(aE, aG, aJ, aF, aI, aK);
		return aI
	}
	Ext
			.apply(
					m,
					{
						addListener : m.on = function(aE, A, aG, aF, E) {
							if (typeof A == "object") {
								var aJ = A, aH, aI;
								for (aH in aJ) {
									if (!aJ.hasOwnProperty(aH)) {
										continue
									}
									aI = aJ[aH];
									if (!aa.test(aH)) {
										if (Ext.isFunction(aI)) {
											U(aE, aH, aJ, aI, aJ.scope)
										} else {
											U(aE, aH, aI)
										}
									}
								}
							} else {
								U(aE, A, E, aG, aF)
							}
						},
						removeListener : m.un = function(aH, aI, aM, aP) {
							var E = Ext.getDom(aH);
							E && Ext.get(E);
							var aN = E ? T(E) : {}, aK = E && ((aN[E.id] || {
								events : {}
							}).events)[aI] || [], A, aG, aE, aF, aJ, aL, aO;
							for (aG = 0, aJ = aK.length; aG < aJ; aG++) {
								if (Ext.isArray(aL = aK[aG]) && aL[0] == aM
										&& (!aP || aL[2] == aP)) {
									aL[4] && aL[4].cancel();
									aF = aM.tasks && aM.tasks.length;
									if (aF) {
										while (aF--) {
											aM.tasks[aF].cancel()
										}
										delete aM.tasks
									}
									A = aL[1];
									aj.un(E, aI, aj.extAdapter ? aL[3] : A);
									if (A && aI == "mousewheel"
											&& E.addEventListener) {
										E.removeEventListener("DOMMouseScroll",
												A, false)
									}
									if (A && aI == "mousedown" && an == E) {
										Ext.EventManager.stoppedMouseDownEvent
												.removeListener(A)
									}
									aK.splice(aG, 1);
									if (aK.length === 0) {
										delete aN[E.id].events[aI]
									}
									aO = aN[E.id].events;
									for (aF in aO) {
										if (aO.hasOwnProperty(aF)) {
											return false
										}
									}
									aN[E.id].events = {};
									return false
								}
							}
						},
						removeAll : function(aE) {
							if (!(aE = Ext.getDom(aE))) {
								return
							}
							var E = aE.id, aM = T(aE) || {}, aN = aM[E] || {}, aL = aN.events
									|| {}, aI, aH, aJ, aF, aK, aG, A;
							for (aF in aL) {
								if (aL.hasOwnProperty(aF)) {
									aI = aL[aF];
									for (aH = 0, aJ = aI.length; aH < aJ; aH++) {
										aK = aI[aH];
										aK[4] && aK[4].cancel();
										if (aK[0] && aK[0].tasks
												&& (aG = aK[0].tasks.length)) {
											while (aG--) {
												aK[0].tasks[aG].cancel()
											}
											delete aK.tasks
										}
										A = aK[1];
										aj
												.un(aE, aF,
														aj.extAdapter ? aK[3]
																: A);
										if (A && aE.addEventListener
												&& aF == "mousewheel") {
											aE.removeEventListener(
													"DOMMouseScroll", A, false)
										}
										if (A && (an == aE)
												&& aF == "mousedown") {
											Ext.EventManager.stoppedMouseDownEvent
													.removeListener(A)
										}
									}
								}
							}
							aM[E] && (aM[E].events = {})
						},
						getListeners : function(aE, E) {
							aE = Ext.getDom(aE);
							if (!aE) {
								return
							}
							var aG = (Ext.get(aE) || {}).id, A = T(aE), aF = (A[aG] || {}).events
									|| {};
							return aF[E] || null
						},
						purgeElement : function(aE, A, aG) {
							aE = Ext.getDom(aE);
							var E = Ext.id(aE), aJ = T(aE), aK = (aJ[E] || {}).events
									|| {}, aF, aI, aH;
							if (aG) {
								if (aK.hasOwnProperty(aG)) {
									aI = aK[aG];
									for (aF = 0, aH = aI.length; aF < aH; aF++) {
										m.removeListener(aE, aG, aI[aF][0])
									}
								}
							} else {
								m.removeAll(aE)
							}
							if (A && aE && aE.childNodes) {
								for (aF = 0, aH = aE.childNodes.length; aF < aH; aF++) {
									m.purgeElement(aE.childNodes[aF], A, aG)
								}
							}
						}
					});
	aj.getListeners = function(E, A) {
		return Ext.EventManager.getListeners(E, A)
	};
	Ext.provide && Ext.provide("multidom")
})();
(function() {
	var El = Ext.Element, ElFrame, ELD = Ext.lib.Dom, EMPTYFN = function() {
	}, OP = Object.prototype, addListener = function() {
		var handler;
		if (window.addEventListener) {
			handler = function F(el, eventName, fn, capture) {
				el.addEventListener(eventName, fn, !!capture)
			}
		} else {
			if (window.attachEvent) {
				handler = function F(el, eventName, fn, capture) {
					el.attachEvent("on" + eventName, fn)
				}
			} else {
				handler = function F() {
				}
			}
		}
		var F = null;
		return handler
	}(), removeListener = function() {
		var handler;
		if (window.removeEventListener) {
			handler = function F(el, eventName, fn, capture) {
				el.removeEventListener(eventName, fn, (capture))
			}
		} else {
			if (window.detachEvent) {
				handler = function F(el, eventName, fn) {
					el.detachEvent("on" + eventName, fn)
				}
			} else {
				handler = function F() {
				}
			}
		}
		var F = null;
		return handler
	}();
	if (typeof ELD.getDocument != "function") {
		alert("MIF 2.1.4 requires multidom support")
	}
	if (!Ext.elCache || parseInt(Ext.version.replace(/\./g, ""), 10) < 311) {
		alert("Ext Release " + Ext.version + " is not supported")
	}
	Ext.ns("Ext.ux.ManagedIFrame", "Ext.ux.plugin");
	var MIM, MIF = Ext.ux.ManagedIFrame, MIFC;
	var frameEvents = [ "documentloaded", "domready", "focus", "blur",
			"resize", "scroll", "unload", "scroll", "exception", "message",
			"reset" ];
	var reSynthEvents = new RegExp("^(" + frameEvents.join("|") + ")", "i");
	Ext.ux.ManagedIFrame.Element = Ext
			.extend(
					Ext.Element,
					{
						constructor : function(element, forceNew, doc) {
							var d = doc || document, elCache = ELD
									.resolveDocumentCache(d), dom = Ext.getDom(
									element, false, d);
							if (!dom || !(/^(iframe|frame)/i).test(dom.tagName)) {
								return null
							}
							var id = Ext.id(dom);
							this.dom = dom;
							this.id = id;
							(elCache[id] || (elCache[id] = {
								el : this,
								events : {},
								data : {}
							})).el = this;
							this.dom.name || (this.dom.name = this.id);
							if (Ext.isIE) {
								document.frames
										&& (document.frames[this.dom.name] || (document.frames[this.dom.name] = this.dom))
							}
							this.dom.ownerCt = this;
							MIM.register(this);
							if (!this._observable) {
								(this._observable = new Ext.util.Observable())
										.addEvents("documentloaded",
												"domready", "exception",
												"resize", "message", "blur",
												"focus", "unload", "scroll",
												"reset");
								this._observable.addEvents("_docready",
										"_docload")
							}
							this.on(Ext.isIE ? "readystatechange" : "load",
									this.loadHandler, this, Ext.isOpera ? {
										buffer : this.operaLoadBuffer || 2000
									} : null);
							this.on("error", this.loadHandler, this)
						},
						destructor : function() {
							MIM.deRegister(this);
							this.removeAllListeners();
							Ext.destroy(this.frameShim, this.DDM);
							this.hideMask(true);
							delete this.loadMask;
							this.reset();
							this.manager = null;
							this.dom.ownerCt = null
						},
						cleanse : function(forceReclean, deep) {
							if (this.isCleansed && forceReclean !== true) {
								return this
							}
							var d = this.dom, n = d.firstChild, nx;
							while (d && n) {
								nx = n.nextSibling;
								deep && Ext.fly(n).cleanse(forceReclean, deep);
								Ext.removeNode(n);
								n = nx
							}
							this.isCleansed = true;
							return this
						},
						src : null,
						CSS : null,
						manager : null,
						operaLoadBuffer : 2000,
						disableMessaging : true,
						domReadyRetries : 7500,
						focusOnLoad : Ext.isIE,
						eventsFollowFrameLinks : true,
						remove : function() {
							this.destructor.apply(this, arguments);
							ElFrame.superclass.remove.apply(this, arguments)
						},
						getDocument : function() {
							return this.dom ? this.dom.ownerDocument : document
						},
						submitAsTarget : function(submitCfg) {
							var opt = submitCfg || {}, D = this.getDocument(), form = Ext
									.getDom(opt.form ? opt.form.form
											|| opt.form : null, false, D)
									|| Ext.DomHelper.append(D.body, {
										tag : "form",
										cls : "x-hidden x-mif-form",
										encoding : "multipart/form-data"
									}), formFly = Ext.fly(form, "_dynaForm"), formState = {
								target : form.target || "",
								method : form.method || "",
								encoding : form.encoding || "",
								enctype : form.enctype || "",
								action : form.action || ""
							}, encoding = opt.encoding || form.encoding, method = opt.method
									|| form.method || "POST";
							formFly.set( {
								target : this.dom.name,
								method : method,
								encoding : encoding,
								action : opt.url || opt.action || form.action
							});
							if (method == "POST" || !!opt.enctype) {
								formFly.set( {
									enctype : opt.enctype || form.enctype
											|| encoding
								})
							}
							var hiddens, hd, ps;
							if (opt.params
									&& (ps = Ext.isFunction(opt.params) ? opt
											.params() : opt.params)) {
								hiddens = [];
								Ext.iterate(ps = typeof ps == "string" ? Ext
										.urlDecode(ps, false) : ps, function(n,
										v) {
									Ext.fly(hd = D.createElement("input")).set(
											{
												type : "hidden",
												name : n,
												value : v
											});
									form.appendChild(hd);
									hiddens.push(hd)
								})
							}
							opt.callback
									&& this._observable.addListener(
											"_docready", opt.callback,
											opt.scope, {
												single : true
											});
							this._frameAction = true;
							this._targetURI = location.href;
							this.showMask();
							(function() {
								form.submit();
								hiddens
										&& Ext.each(hiddens, Ext.removeNode,
												Ext);
								if (formFly.hasClass("x-mif-form")) {
									formFly.remove()
								} else {
									formFly.set(formState)
								}
								delete El._flyweights._dynaForm;
								formFly = null;
								this.hideMask(true)
							}).defer(100, this);
							return this
						},
						resetUrl : (function() {
							return Ext.isIE && Ext.isSecure ? Ext.SSL_SECURE_URL
									: "about:blank"
						})(),
						setSrc : function(url, discardUrl, callback, scope) {
							var src = url || this.src || this.resetUrl;
							var O = this._observable;
							this._unHook();
							Ext.isFunction(callback)
									&& O.addListener("_docload", callback,
											scope || this, {
												single : true
											});
							this.showMask();
							(discardUrl !== true) && (this.src = src);
							var s = this._targetURI = (Ext.isFunction(src) ? src()
									|| ""
									: src);
							try {
								this._frameAction = true;
								this.dom.src = s;
								this.checkDOM()
							} catch (ex) {
								O.fireEvent.call(O, "exception", this, ex)
							}
							return this
						},
						setLocation : function(url, discardUrl, callback, scope) {
							var src = url || this.src || this.resetUrl;
							var O = this._observable;
							this._unHook();
							Ext.isFunction(callback)
									&& O.addListener("_docload", callback,
											scope || this, {
												single : true
											});
							this.showMask();
							var s = this._targetURI = (Ext.isFunction(src) ? src()
									|| ""
									: src);
							if (discardUrl !== true) {
								this.src = src
							}
							try {
								this._frameAction = true;
								this.getWindow().location.replace(s);
								this.checkDOM()
							} catch (ex) {
								O.fireEvent.call(O, "exception", this, ex)
							}
							return this
						},
						reset : function(src, callback, scope) {
							this._unHook();
							var loadMaskOff = false, s = src, win = this
									.getWindow(), O = this._observable;
							if (this.loadMask) {
								loadMaskOff = this.loadMask.disabled;
								this.loadMask.disabled = false
							}
							this.hideMask(true);
							if (win) {
								this.isReset = true;
								var cb = callback;
								O.addListener("_docload", function(frame) {
									if (this.loadMask) {
										this.loadMask.disabled = loadMaskOff
									}
									Ext.isFunction(cb)
											&& (cb = cb.apply(scope || this,
													arguments));
									O.fireEvent("reset", this)
								}, this, {
									single : true
								});
								Ext.isFunction(s) && (s = src());
								s = this._targetURI = Ext.isEmpty(s, true) ? this.resetUrl
										: s;
								win.location ? (win.location.href = s) : O
										.fireEvent("_docload", this)
							}
							return this
						},
						scriptRE : /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/gi,
						update : function(content, loadScripts, callback, scope) {
							loadScripts = loadScripts
									|| this.getUpdater().loadScripts || false;
							content = Ext.DomHelper.markup(content || "");
							content = loadScripts === true ? content : content
									.replace(this.scriptRE, "");
							var doc;
							if ((doc = this.getFrameDocument())
									&& !!content.length) {
								this._unHook();
								this.src = null;
								this.showMask();
								Ext.isFunction(callback)
										&& this._observable.addListener(
												"_docload", callback, scope
														|| this, {
													single : true
												});
								this._targetURI = location.href;
								doc.open();
								this._frameAction = true;
								doc.write(content);
								doc.close();
								this.checkDOM()
							} else {
								this.hideMask(true);
								Ext.isFunction(callback)
										&& callback.call(scope, this)
							}
							return this
						},
						execCommand : function(command, userInterface, value,
								validate) {
							var doc, assert;
							if ((doc = this.getFrameDocument()) && !!command) {
								try {
									Ext.isIE && this.getWindow().focus();
									assert = validate
											&& Ext
													.isFunction(doc.queryCommandEnabled) ? doc
											.queryCommandEnabled(command)
											: true;
									return assert
											&& doc.execCommand(command,
													!!userInterface, value)
								} catch (eex) {
									return false
								}
							}
							return false
						},
						setDesignMode : function(active) {
							var doc;
							(doc = this.getFrameDocument())
									&& (doc.designMode = (/on|true/i)
											.test(String(active)) ? "on"
											: "off")
						},
						getUpdater : function() {
							return this.updateManager
									|| (this.updateManager = new MIF.Updater(
											this))
						},
						getHistory : function() {
							var h = null;
							try {
								h = this.getWindow().history
							} catch (eh) {
							}
							return h
						},
						get : function(el) {
							var doc = this.getFrameDocument();
							return doc ? Ext.get(el, doc) : doc = null
						},
						fly : function(el, named) {
							var doc = this.getFrameDocument();
							return doc ? Ext.fly(el, named, doc) : null
						},
						getDom : function(el) {
							var d;
							if (!el || !(d = this.getFrameDocument())) {
								return (d = null)
							}
							return Ext.getDom(el, d)
						},
						select : function(selector, unique) {
							var d;
							return (d = this.getFrameDocument()) ? Ext.Element
									.select(selector, unique, d) : d = null
						},
						query : function(selector) {
							var d;
							return (d = this.getFrameDocument()) ? Ext.DomQuery
									.select(selector, d) : null
						},
						removeNode : Ext.removeNode,
						_renderHook : function() {
							this._windowContext = null;
							this.CSS = this.CSS ? this.CSS.destroy() : null;
							this._hooked = false;
							try {
								if (this
										.writeScript('(function(){(window.hostMIF = parent.document.getElementById("'
												+ this.id
												+ '").ownerCt)._windowContext='
												+ (Ext.isIE ? "window"
														: '{eval:function(s){return new Function("return ("+s+")")();}}')
												+ ";})()")) {
									var w, p = this._frameProxy, D = this
											.getFrameDocument();
									if (w = this.getWindow()) {
										p
												|| (p = this._frameProxy = this._eventProxy
														.createDelegate(this));
										addListener(w, "focus", p);
										addListener(w, "blur", p);
										addListener(w, "resize", p);
										addListener(w, "unload", p);
										D
												&& addListener(
														Ext.isIE ? w : D,
														"scroll", p)
									}
									D
											&& (this.CSS = new Ext.ux.ManagedIFrame.CSS(
													D))
								}
							} catch (ex) {
							}
							return this.domWritable()
						},
						_unHook : function() {
							if (this._hooked) {
								this._windowContext
										&& (this._windowContext.hostMIF = null);
								this._windowContext = null;
								var w, p = this._frameProxy;
								if (p && this.domWritable()
										&& (w = this.getWindow())) {
									removeListener(w, "focus", p);
									removeListener(w, "blur", p);
									removeListener(w, "resize", p);
									removeListener(w, "unload", p);
									removeListener(Ext.isIE ? w : this
											.getFrameDocument(), "scroll", p)
								}
							}
							ELD.clearDocumentCache
									&& ELD.clearDocumentCache(this.id);
							this.CSS = this.CSS ? this.CSS.destroy() : null;
							this.domFired = this._frameAction = this.domReady = this._hooked = false
						},
						_windowContext : null,
						getFrameDocument : function() {
							var win = this.getWindow(), doc = null;
							try {
								doc = (Ext.isIE && win ? win.document : null)
										|| this.dom.contentDocument
										|| window.frames[this.dom.name].document
										|| null
							} catch (gdEx) {
								ELD.clearDocumentCache
										&& ELD.clearDocumentCache(this.id);
								return false
							}
							doc = (doc && Ext.isFunction(ELD.getDocument)) ? ELD
									.getDocument(doc, true)
									: doc;
							return doc
						},
						getDoc : function() {
							var D = this.getFrameDocument();
							return Ext.get(D, D)
						},
						getBody : function() {
							var d;
							return (d = this.getFrameDocument()) ? this
									.get(d.body || d.documentElement) : null
						},
						getDocumentURI : function() {
							var URI, d;
							try {
								URI = this.src && (d = this.getFrameDocument()) ? d.location.href
										: null
							} catch (ex) {
							}
							return URI
									|| (Ext.isFunction(this.src) ? this.src()
											: this.src)
						},
						getWindowURI : function() {
							var URI, w;
							try {
								URI = (w = this.getWindow()) ? w.location.href
										: null
							} catch (ex) {
							}
							return URI
									|| (Ext.isFunction(this.src) ? this.src()
											: this.src)
						},
						getWindow : function() {
							var dom = this.dom, win = null;
							try {
								win = dom.contentWindow
										|| window.frames[dom.name] || null
							} catch (gwEx) {
							}
							return win
						},
						scrollChildIntoView : function(child, container,
								hscroll) {
							this.fly(child, "_scrollChildIntoView")
									.scrollIntoView(
											this.getDom(container)
													|| this.getBody().dom,
											hscroll);
							return this
						},
						print : function() {
							try {
								var win;
								if (win = this.getWindow()) {
									Ext.isIE && win.focus();
									win.print()
								}
							} catch (ex) {
								throw new MIF.Error("printexception",
										ex.description || ex.message || ex)
							}
							return this
						},
						domWritable : function() {
							return !!Ext.isDocument(this.getFrameDocument(),
									true)
									&& !!this._windowContext
						},
						execScript : function(block, useDOM) {
							try {
								if (this.domWritable()) {
									if (useDOM) {
										this.writeScript(block)
									} else {
										return this._windowContext.eval(block)
									}
								} else {
									throw new MIF.Error(
											"execscript-secure-context")
								}
							} catch (ex) {
								this._observable.fireEvent
										.call(this._observable, "exception",
												this, ex);
								return false
							}
							return true
						},
						writeScript : function(block, attributes) {
							attributes = Ext.apply( {}, attributes || {}, {
								type : "text/javascript",
								text : block
							});
							try {
								var head, script, doc = this.getFrameDocument();
								if (doc
										&& typeof doc.getElementsByTagName != "undefined") {
									if (!(head = doc
											.getElementsByTagName("head")[0])) {
										head = doc.createElement("head");
										doc.getElementsByTagName("html")[0]
												.appendChild(head)
									}
									if (head
											&& (script = doc
													.createElement("script"))) {
										for ( var attrib in attributes) {
											if (attributes
													.hasOwnProperty(attrib)
													&& attrib in script) {
												script[attrib] = attributes[attrib]
											}
										}
										return !!head.appendChild(script)
									}
								}
							} catch (ex) {
								this._observable.fireEvent
										.call(this._observable, "exception",
												this, ex)
							} finally {
								script = head = null
							}
							return false
						},
						loadFunction : function(fn, useDOM, invokeIt) {
							var name = fn.name || fn;
							var fnSrc = fn.fn || window[fn];
							name
									&& fnSrc
									&& this.execScript(name + "=" + fnSrc,
											useDOM);
							invokeIt && this.execScript(name + "()")
						},
						loadHandler : function(e, target) {
							var rstatus = (this.dom || {}).readyState
									|| (e || {}).type;
							if (this.eventsFollowFrameLinks
									|| this._frameAction || this.isReset) {
								switch (rstatus) {
								case "domready":
								case "DOMFrameContentLoaded":
								case "domfail":
									this._onDocReady(rstatus);
									break;
								case "load":
								case "complete":
									var frame = this;
									this._frameAction && setTimeout(function() {
										frame._onDocLoaded(rstatus)
									}, 0.01);
									this._frameAction = false;
									break;
								case "error":
									this._observable.fireEvent.apply(
											this._observable, [ "exception",
													this ].concat(arguments));
									break;
								default:
								}
								this.frameState = rstatus
							}
						},
						_onDocReady : function(eventName) {
							var w, obv = this._observable, D;
							try {
								if (!this.isReset && this.focusOnLoad
										&& (w = this.getWindow())) {
									w.focus()
								}
								(D = this.getDoc()) && (D.isReady = true)
							} catch (ex) {
							}
							obv.fireEvent("_docready", this);
							if (!this.domFired
									&& (this._hooked = this._renderHook())) {
								this.domFired = true;
								this.isReset
										|| obv.fireEvent.call(obv, "domready",
												this)
							}
							this.domReady = true;
							this.hideMask()
						},
						_onDocLoaded : function(eventName) {
							var obv = this._observable, w;
							this.domReady || this._onDocReady("domready");
							obv.fireEvent("_docload", this);
							this.isReset
									|| obv.fireEvent("documentloaded", this);
							this.hideMask(true);
							this._frameAction = this.isReset = false
						},
						checkDOM : function(win) {
							if (Ext.isGecko) {
								return
							}
							var n = 0, frame = this, domReady = false, b, l, d, max = this.domReadyRetries || 2500, polling = false, startLocation = (this
									.getFrameDocument() || {
								location : {}
							}).location.href;
							(function() {
								d = frame.getFrameDocument() || {
									location : {}
								};
								polling = (d.location.href !== startLocation || d.location.href === frame._targetURI);
								if (frame.domReady) {
									return
								}
								domReady = polling
										&& ((b = frame.getBody()) && !!(b.dom.innerHTML || "").length)
										|| false;
								if (d.location.href && !domReady && (++n < max)) {
									setTimeout(arguments.callee, 2);
									return
								}
								frame.loadHandler( {
									type : domReady ? "domready" : "domfail"
								})
							})()
						},
						filterEventOptionsRe : /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,
						addListener : function(eventName, fn, scope, options) {
							if (typeof eventName == "object") {
								var o = eventName;
								for ( var e in o) {
									if (this.filterEventOptionsRe.test(e)) {
										continue
									}
									if (typeof o[e] == "function") {
										this.addListener(e, o[e], o.scope, o)
									} else {
										this.addListener(e, o[e].fn,
												o[e].scope, o[e])
									}
								}
								return
							}
							if (reSynthEvents.test(eventName)) {
								var O = this._observable;
								if (O) {
									O.events[eventName]
											|| (O.addEvents(eventName));
									O.addListener.call(O, eventName, fn, scope
											|| this, options)
								}
							} else {
								ElFrame.superclass.addListener.call(this,
										eventName, fn, scope || this, options)
							}
							return this
						},
						removeListener : function(eventName, fn, scope) {
							var O = this._observable;
							if (reSynthEvents.test(eventName)) {
								O
										&& O.removeListener.call(O, eventName,
												fn, scope || this, options)
							} else {
								ElFrame.superclass.removeListener.call(this,
										eventName, fn, scope || this)
							}
							return this
						},
						removeAllListeners : function() {
							Ext.EventManager.removeAll(this.dom);
							var O = this._observable;
							O && O.purgeListeners.call(this._observable);
							return this
						},
						showMask : function(msg, msgCls, maskCls) {
							var lmask = this.loadMask;
							if (lmask && !lmask.disabled) {
								this.mask(msg || lmask.msg, msgCls
										|| lmask.msgCls, maskCls
										|| lmask.maskCls, lmask.maskEl)
							}
						},
						hideMask : function(forced) {
							var tlm = this.loadMask || {};
							if (forced || (tlm.hideOnReady && this.domReady)) {
								this.unmask()
							}
						},
						mask : function(msg, msgCls, maskCls, maskEl) {
							this._mask && this.unmask();
							var p = Ext.get(maskEl)
									|| this.parent(".ux-mif-mask-target")
									|| this.parent();
							if (p.getStyle("position") == "static"
									&& !p.select("iframe,frame,object,embed").elements.length) {
								p.addClass("x-masked-relative")
							}
							p.addClass("x-masked");
							this._mask = Ext.DomHelper.append(p, {
								cls : maskCls || "ux-mif-el-mask"
							}, true);
							this._mask.setDisplayed(true);
							this._mask._agent = p;
							if (typeof msg == "string") {
								this._maskMsg = Ext.DomHelper.append(p, {
									cls : msgCls || "ux-mif-el-mask-msg",
									style : {
										visibility : "hidden"
									},
									cn : {
										tag : "div",
										html : msg
									}
								}, true);
								this._maskMsg.setVisibilityMode(
										Ext.Element.VISIBILITY).center(p)
										.setVisible(true)
							}
							if (Ext.isIE && !(Ext.isIE7 && Ext.isStrict)
									&& this.getStyle("height") == "auto") {
								this._mask.setSize(undefined, this._mask
										.getHeight())
							}
							return this._mask
						},
						unmask : function() {
							var a;
							if (this._mask) {
								(a = this._mask._agent)
										&& a
												.removeClass( [
														"x-masked-relative",
														"x-masked" ]);
								if (this._maskMsg) {
									this._maskMsg.remove();
									delete this._maskMsg
								}
								this._mask.remove();
								delete this._mask
							}
						},
						createFrameShim : function(imgUrl, shimCls) {
							this.shimCls = shimCls || this.shimCls
									|| "ux-mif-shim";
							this.frameShim
									|| (this.frameShim = this.next("."
											+ this.shimCls)
											|| Ext.DomHelper
													.append(
															this.dom.parentNode,
															{
																tag : "img",
																src : imgUrl
																		|| Ext.BLANK_IMAGE_URL,
																cls : this.shimCls,
																galleryimg : "no"
															}, true));
							this.frameShim
									&& (this.frameShim.autoBoxAdjust = false);
							return this.frameShim
						},
						toggleShim : function(show) {
							var shim = this.frameShim || this.createFrameShim();
							var cls = this.shimCls + "-on";
							!show && shim.removeClass(cls);
							show && !shim.hasClass(cls) && shim.addClass(cls)
						},
						load : function(loadCfg) {
							var um;
							if (um = this.getUpdater()) {
								if (loadCfg && loadCfg.renderer) {
									um.setRenderer(loadCfg.renderer);
									delete loadCfg.renderer
								}
								um.update.apply(um, arguments)
							}
							return this
						},
						_eventProxy : function(e) {
							if (!e) {
								return
							}
							e = Ext.EventObject.setEvent(e);
							var be = e.browserEvent || e, er, args = [ e.type,
									this ];
							if (!be.eventPhase
									|| (be.eventPhase == (be.AT_TARGET || 2))) {
								if (e.type == "resize") {
									var doc = this.getFrameDocument();
									doc && (args.push( {
										height : ELD.getDocumentHeight(doc),
										width : ELD.getDocumentWidth(doc)
									}, {
										height : ELD.getViewportHeight(doc),
										width : ELD.getViewportWidth(doc)
									}, {
										height : ELD.getViewHeight(false, doc),
										width : ELD.getViewWidth(false, doc)
									}))
								}
								er = this._observable ? this._observable.fireEvent
										.apply(this._observable, args
												.concat(Array.prototype.slice
														.call(arguments, 0)))
										: null;
								(e.type == "unload") && this._unHook()
							}
							return er
						},
						sendMessage : function(message, tag, origin) {
						},
						postMessage : function(message, origin) {
						}
					});
	ElFrame = Ext.Element.IFRAME = Ext.Element.FRAME = Ext.ux.ManagedIFrame.Element;
	var fp = ElFrame.prototype;
	Ext.override(ElFrame, {
		on : fp.addListener,
		un : fp.removeListener,
		getUpdateManager : fp.getUpdater
	});
	Ext.ux.ManagedIFrame.ComponentAdapter = function() {
	};
	Ext.ux.ManagedIFrame.ComponentAdapter.prototype = {
		version : 2.14,
		defaultSrc : null,
		unsupportedText : "Inline frames are NOT enabled/supported by your browser.",
		hideMode : !Ext.isIE && !!Ext.ux.plugin.VisibilityMode ? "nosize"
				: "display",
		animCollapse : Ext.isIE,
		animFloat : Ext.isIE,
		disableMessaging : true,
		eventsFollowFrameLinks : true,
		frameConfig : null,
		focusOnLoad : Ext.isIE,
		frameEl : null,
		useShim : false,
		autoScroll : true,
		autoLoad : null,
		getId : function() {
			return this.id
					|| (this.id = "mif-comp-" + (++Ext.Component.AUTO_ID))
		},
		stateEvents : [ "documentloaded" ],
		stateful : false,
		setAutoScroll : function(auto) {
			var scroll = Ext.value(auto, this.autoScroll === true);
			this.rendered
					&& this.getFrame()
					&& this.frameEl
							.setOverflow((this.autoScroll = scroll) ? "auto"
									: "hidden");
			return this
		},
		getContentTarget : function() {
			return this.getFrame()
		},
		getFrame : function() {
			if (this.rendered) {
				if (this.frameEl) {
					return this.frameEl
				}
				var f = this.items && this.items.first ? this.items.first()
						: null;
				f && (this.frameEl = f.frameEl);
				return this.frameEl
			}
			return null
		},
		getFrameWindow : function() {
			return this.getFrame() ? this.frameEl.getWindow() : null
		},
		getFrameDocument : function() {
			return this.getFrame() ? this.frameEl.getFrameDocument() : null
		},
		getFrameDoc : function() {
			return this.getFrame() ? this.frameEl.getDoc() : null
		},
		getFrameBody : function() {
			return this.getFrame() ? this.frameEl.getBody() : null
		},
		resetFrame : function() {
			this.getFrame()
					&& this.frameEl.reset.apply(this.frameEl, arguments);
			return this
		},
		submitAsTarget : function(submitCfg) {
			this.getFrame()
					&& this.frameEl.submitAsTarget.apply(this.frameEl,
							arguments);
			return this
		},
		load : function(loadCfg) {
			if (loadCfg && this.getFrame()) {
				var args = arguments;
				this.resetFrame(null, function() {
					loadCfg.submitAsTarget ? this.submitAsTarget.apply(this,
							args) : this.frameEl.load.apply(this.frameEl, args)
				}, this)
			}
			this.autoLoad = loadCfg;
			return this
		},
		doAutoLoad : function() {
			this.autoLoad
					&& this
							.load(typeof this.autoLoad == "object" ? this.autoLoad
									: {
										url : this.autoLoad
									})
		},
		getUpdater : function() {
			return this.getFrame() ? this.frameEl.getUpdater() : null
		},
		setSrc : function(url, discardUrl, callback, scope) {
			this.getFrame()
					&& this.frameEl.setSrc.apply(this.frameEl, arguments);
			return this
		},
		setLocation : function(url, discardUrl, callback, scope) {
			this.getFrame()
					&& this.frameEl.setLocation.apply(this.frameEl, arguments);
			return this
		},
		getState : function() {
			var URI = this.getFrame() ? this.frameEl.getDocumentURI() || null
					: null;
			var state = this.supr().getState.call(this);
			state = Ext.apply(state || {}, {
				defaultSrc : Ext.isFunction(URI) ? URI() : URI,
				autoLoad : this.autoLoad
			});
			return state
		},
		setMIFEvents : function() {
			this.addEvents("documentloaded", "domready", "exception",
					"message", "blur", "focus", "scroll", "resize", "unload",
					"reset")
		},
		sendMessage : function(message, tag, origin) {
		},
		onAdd : function(C) {
			C.relayTarget && this.suspendEvents(true)
		},
		initRef : function() {
			if (this.ref) {
				var t = this, levels = this.ref.split("/"), l = levels.length, i;
				for (i = 0; i < l; i++) {
					if (t.ownerCt) {
						t = t.ownerCt
					}
				}
				this.refName = levels[--i];
				t[this.refName] || (t[this.refName] = this);
				this.refOwner = t
			}
		}
	};
	Ext.ux.ManagedIFrame.Component = Ext
			.extend(
					Ext.BoxComponent,
					{
						ctype : "Ext.ux.ManagedIFrame.Component",
						initComponent : function() {
							var C = {
								monitorResize : this.monitorResize
										|| (this.monitorResize = !!this.fitToParent),
								plugins : (this.plugins || [])
										.concat(this.hideMode === "nosize"
												&& Ext.ux.plugin.VisibilityMode ? [ new Ext.ux.plugin.VisibilityMode(
												{
													hideMode : "nosize",
													elements : [ "bwrap" ]
												}) ]
												: [])
							};
							MIF.Component.superclass.initComponent.call(Ext
									.apply(this, Ext.apply(this.initialConfig,
											C)));
							this.setMIFEvents()
						},
						onRender : function(ct, position) {
							var frCfg = this.frameCfg || this.frameConfig
									|| (this.relayTarget ? {
										name : this.relayTarget.id
									} : {}) || {};
							var frDOM = frCfg.autoCreate || frCfg;
							frDOM = Ext.apply( {
								tag : "iframe",
								id : Ext.id()
							}, frDOM);
							var el = Ext.getDom(this.el);
							(el && el.tagName == "iframe")
									|| (this.autoEl = Ext.apply( {
										name : frDOM.id,
										frameborder : 0
									}, frDOM));
							MIF.Component.superclass.onRender.apply(this,
									arguments);
							if (this.unsupportedText) {
								ct.child("noframes") || ct.createChild( {
									tag : "noframes",
									html : this.unsupportedText || null
								})
							}
							var frame = this.el;
							var F;
							if (F = this.frameEl = (this.el ? new MIF.Element(
									this.el.dom, true) : null)) {
								Ext.apply(F, {
									ownerCt : this.relayTarget || this,
									disableMessaging : Ext.value(
											this.disableMessaging, true),
									focusOnLoad : Ext.value(this.focusOnLoad,
											Ext.isIE),
									eventsFollowFrameLinks : Ext.value(
											this.eventsFollowFrameLinks, true)
								});
								F.ownerCt.frameEl = F;
								F.addClass("ux-mif");
								if (this.loadMask) {
									var mEl = this.loadMask.maskEl;
									F.loadMask = Ext
											.apply(
													{
														disabled : false,
														hideOnReady : false,
														msgCls : "ext-el-mask-msg x-mask-loading",
														maskCls : "ext-el-mask"
													},
													{
														maskEl : F.ownerCt[String(mEl)]
																|| F
																		.parent("."
																				+ String(mEl))
																|| F
																		.parent(".ux-mif-mask-target")
																|| mEl
													},
													Ext.isString(this.loadMask) ? {
														msg : this.loadMask
													}
															: this.loadMask);
									Ext.get(F.loadMask.maskEl)
											&& Ext
													.get(F.loadMask.maskEl)
													.addClass(
															"ux-mif-mask-target")
								}
								F._observable
										&& (this.relayTarget || this)
												.relayEvents(
														F._observable,
														frameEvents
																.concat(this._msgTagHandlers
																		|| []));
								delete this.contentEl
							}
						},
						afterRender : function(container) {
							MIF.Component.superclass.afterRender.apply(this,
									arguments);
							if (this.fitToParent && !this.ownerCt) {
								var pos = this.getPosition(), size = (Ext
										.get(this.fitToParent) || this.getEl()
										.parent()).getViewSize();
								this.setSize(size.width - pos[0], size.height
										- pos[1])
							}
							this.getEl().setOverflow("hidden");
							this.setAutoScroll();
							var F;
							if (F = this.frameEl) {
								var ownerCt = this.ownerCt;
								while (ownerCt) {
									ownerCt
											.on(
													"afterlayout",
													function(container, layout) {
														Ext
																.each(
																		[
																				"north",
																				"south",
																				"east",
																				"west" ],
																		function(
																				region) {
																			var reg;
																			if ((reg = layout[region])
																					&& reg.split
																					&& reg.split.dd
																					&& !reg._splitTrapped) {
																				reg.split.dd.endDrag = reg.split.dd.endDrag
																						.createSequence(
																								MIM.hideShims,
																								MIM);
																				reg.split
																						.on(
																								"beforeresize",
																								MIM.showShims,
																								MIM);
																				reg._splitTrapped = MIM._splitTrapped = true
																			}
																		}, this)
													}, this, {
														single : true
													});
									ownerCt = ownerCt.ownerCt
								}
								if (!!this.ownerCt || this.useShim) {
									this.frameShim = F.createFrameShim()
								}
								this.getUpdater().showLoadIndicator = this.showLoadIndicator || false;
								var resumeEvents = this.relayTarget
										&& this.ownerCt ? this.ownerCt.resumeEvents
										.createDelegate(this.ownerCt)
										: null;
								if (this.autoload) {
									this.doAutoLoad()
								} else {
									if (this.tpl
											&& (this.frameData || this.data)) {
										F.update(this.tpl.apply(this.frameData
												|| this.data), true,
												resumeEvents);
										delete this.frameData;
										delete this.data;
										return
									} else {
										if (this.frameMarkup || this.html) {
											F.update(this.frameMarkup
													|| this.html, true,
													resumeEvents);
											delete this.html;
											delete this.frameMarkup;
											return
										} else {
											if (this.defaultSrc) {
												F
														.setSrc(
																this.defaultSrc,
																false)
											} else {
												F.reset(null, resumeEvents);
												return
											}
										}
									}
								}
								resumeEvents && resumeEvents()
							}
						},
						beforeDestroy : function() {
							var F;
							if (F = this.getFrame()) {
								F.remove();
								this.frameEl = this.frameShim = null
							}
							this.relayTarget
									&& (this.relayTarget.frameEl = null);
							MIF.Component.superclass.beforeDestroy.call(this)
						}
					});
	Ext.override(MIF.Component, MIF.ComponentAdapter.prototype);
	Ext.reg("mif", MIF.Component);
	function embed_MIF(config) {
		config || (config = {});
		config.layout = "fit";
		config.items = {
			xtype : "mif",
			ref : "mifChild",
			useShim : true,
			tpl : Ext.value(config.tpl, this.tpl),
			autoScroll : Ext.value(config.autoScroll, this.autoScroll),
			defaultSrc : Ext.value(config.defaultSrc, this.defaultSrc),
			frameMarkup : Ext.value(config.html, this.html),
			frameData : Ext.value(config.data, this.data),
			loadMask : Ext.value(config.loadMask, this.loadMask),
			disableMessaging : Ext.value(config.disableMessaging,
					this.disableMessaging),
			eventsFollowFrameLinks : Ext.value(config.eventsFollowFrameLinks,
					this.eventsFollowFrameLinks),
			focusOnLoad : Ext.value(config.focusOnLoad, this.focusOnLoad),
			frameConfig : Ext.value(config.frameConfig || config.frameCfg,
					this.frameConfig),
			relayTarget : this
		};
		delete config.html;
		delete config.data;
		this.setMIFEvents();
		return config
	}
	Ext.ux.ManagedIFrame.Panel = Ext.extend(Ext.Panel, {
		ctype : "Ext.ux.ManagedIFrame.Panel",
		bodyCssClass : "ux-mif-mask-target",
		constructor : function(config) {
			MIF.Panel.superclass.constructor.call(this, embed_MIF.call(this,
					config))
		}
	});
	Ext.override(MIF.Panel, MIF.ComponentAdapter.prototype);
	Ext.reg("iframepanel", MIF.Panel);
	Ext.ux.ManagedIFrame.Portlet = Ext.extend(Ext.ux.ManagedIFrame.Panel, {
		ctype : "Ext.ux.ManagedIFrame.Portlet",
		anchor : "100%",
		frame : true,
		collapseEl : "bwrap",
		collapsible : true,
		draggable : true,
		cls : "x-portlet"
	});
	Ext.reg("iframeportlet", MIF.Portlet);
	Ext.ux.ManagedIFrame.Window = Ext.extend(Ext.Window, {
		ctype : "Ext.ux.ManagedIFrame.Window",
		bodyCssClass : "ux-mif-mask-target",
		constructor : function(config) {
			MIF.Window.superclass.constructor.call(this, embed_MIF.call(this,
					config))
		}
	});
	Ext.override(MIF.Window, MIF.ComponentAdapter.prototype);
	Ext.reg("iframewindow", MIF.Window);
	Ext.ux.ManagedIFrame.Updater = Ext.extend(Ext.Updater, {
		showLoading : function() {
			this.showLoadIndicator && this.el
					&& this.el.mask(this.indicatorText)
		},
		hideLoading : function() {
			this.showLoadIndicator && this.el && this.el.unmask()
		},
		updateComplete : function(response) {
			MIF.Updater.superclass.updateComplete.apply(this, arguments);
			this.hideLoading()
		},
		processFailure : function(response) {
			MIF.Updater.superclass.processFailure.apply(this, arguments);
			this.hideLoading()
		}
	});
	var styleCamelRe = /(-[a-z])/gi;
	var styleCamelFn = function(m, a) {
		return a.charAt(1).toUpperCase()
	};
	Ext.ux.ManagedIFrame.CSS = function(hostDocument) {
		var doc;
		if (hostDocument) {
			doc = hostDocument;
			return {
				rules : null,
				destroy : function() {
					return doc = null
				},
				createStyleSheet : function(cssText, id) {
					var ss;
					if (!doc) {
						return
					}
					var head = doc.getElementsByTagName("head")[0];
					var rules = doc.createElement("style");
					rules.setAttribute("type", "text/css");
					Ext.isString(id) && rules.setAttribute("id", id);
					if (Ext.isIE) {
						head.appendChild(rules);
						ss = rules.styleSheet;
						ss.cssText = cssText
					} else {
						try {
							rules.appendChild(doc.createTextNode(cssText))
						} catch (e) {
							rules.cssText = cssText
						}
						head.appendChild(rules);
						ss = rules.styleSheet ? rules.styleSheet
								: (rules.sheet || doc.styleSheets[doc.styleSheets.length - 1])
					}
					this.cacheStyleSheet(ss);
					return ss
				},
				removeStyleSheet : function(id) {
					if (!doc || !id) {
						return
					}
					var existing = doc.getElementById(id);
					if (existing) {
						existing.parentNode.removeChild(existing)
					}
				},
				swapStyleSheet : function(id, url) {
					if (!doc) {
						return
					}
					this.removeStyleSheet(id);
					var ss = doc.createElement("link");
					ss.setAttribute("rel", "stylesheet");
					ss.setAttribute("type", "text/css");
					Ext.isString(id) && ss.setAttribute("id", id);
					ss.setAttribute("href", url);
					doc.getElementsByTagName("head")[0].appendChild(ss)
				},
				refreshCache : function() {
					return this.getRules(true)
				},
				cacheStyleSheet : function(ss, media) {
					this.rules || (this.rules = {});
					try {
						Ext.each(ss.cssRules || ss.rules || [], function(rule) {
							this.hashRule(rule, ss, media)
						}, this);
						Ext.each(ss.imports || [], function(sheet) {
							sheet
									&& this.cacheStyleSheet(sheet, this
											.resolveMedia( [ sheet,
													sheet.parentStyleSheet ]))
						}, this)
					} catch (e) {
					}
				},
				hashRule : function(rule, sheet, mediaOverride) {
					var mediaSelector = mediaOverride
							|| this.resolveMedia(rule);
					if (rule.cssRules || rule.rules) {
						this.cacheStyleSheet(rule, this.resolveMedia( [ rule,
								rule.parentRule ]))
					}
					if (rule.styleSheet) {
						this.cacheStyleSheet(rule.styleSheet, this
								.resolveMedia( [ rule, rule.ownerRule,
										rule.parentStyleSheet ]))
					}
					rule.selectorText
							&& Ext.each((mediaSelector || "").split(","),
									function(media) {
										this.rules[((media ? media.trim() + ":"
												: "") + rule.selectorText)
												.toLowerCase()] = rule
									}, this)
				},
				resolveMedia : function(rule) {
					var media;
					Ext.each( [].concat(rule), function(r) {
						if (r && r.media && r.media.length) {
							media = r.media;
							return false
						}
					});
					return media ? (Ext.isIE ? String(media) : media.mediaText)
							: ""
				},
				getRules : function(refreshCache) {
					if (!this.rules || refreshCache) {
						this.rules = {};
						if (doc) {
							var ds = doc.styleSheets;
							for ( var i = 0, len = ds.length; i < len; i++) {
								try {
									this.cacheStyleSheet(ds[i])
								} catch (e) {
								}
							}
						}
					}
					return this.rules
				},
				getRule : function(selector, refreshCache, mediaSelector) {
					var rs = this.getRules(refreshCache);
					if (Ext.type(mediaSelector) == "string") {
						mediaSelector = mediaSelector.trim() + ":"
					} else {
						mediaSelector = ""
					}
					if (!Ext.isArray(selector)) {
						return rs[(mediaSelector + selector).toLowerCase()]
					}
					var select;
					for ( var i = 0; i < selector.length; i++) {
						select = (mediaSelector + selector[i]).toLowerCase();
						if (rs[select]) {
							return rs[select]
						}
					}
					return null
				},
				updateRule : function(selector, property, value, mediaSelector) {
					Ext.each((mediaSelector || "").split(","),
							function(mediaSelect) {
								if (!Ext.isArray(selector)) {
									var rule = this.getRule(selector, false,
											mediaSelect);
									if (rule) {
										rule.style[property.replace(camelRe,
												camelFn)] = value;
										return true
									}
								} else {
									for ( var i = 0; i < selector.length; i++) {
										if (this.updateRule(selector[i],
												property, value, mediaSelect)) {
											return true
										}
									}
								}
								return false
							}, this)
				}
			}
		}
	};
	Ext.ux.ManagedIFrame.Manager = function() {
		var frames = {};
		var implementation = {
			_DOMFrameReadyHandler : function(e) {
				try {
					var $frame;
					if ($frame = e.target.ownerCt) {
						$frame.loadHandler.call($frame, e)
					}
				} catch (rhEx) {
				}
			},
			shimCls : "ux-mif-shim",
			register : function(frame) {
				frame.manager = this;
				frames[frame.id] = frames[frame.name] = {
					ref : frame
				};
				return frame
			},
			deRegister : function(frame) {
				delete frames[frame.id];
				delete frames[frame.name]
			},
			hideShims : function() {
				var mm = MIF.Manager;
				mm.shimsApplied
						&& Ext.select("." + mm.shimCls, true).removeClass(
								mm.shimCls + "-on");
				mm.shimsApplied = false
			},
			showShims : function() {
				var mm = MIF.Manager;
				!mm.shimsApplied
						&& Ext.select("." + mm.shimCls, true).addClass(
								mm.shimCls + "-on");
				mm.shimsApplied = true
			},
			getFrameById : function(id) {
				return typeof id == "string" ? (frames[id] ? frames[id].ref
						|| null : null) : null
			},
			getFrameByName : function(name) {
				return this.getFrameById(name)
			},
			getFrameHash : function(frame) {
				return frames[frame.id] || frames[frame.id] || null
			},
			destroy : function() {
				if (document.addEventListener && !Ext.isOpera) {
					window.removeEventListener("DOMFrameContentLoaded",
							this._DOMFrameReadyHandler, false)
				}
			}
		};
		document.addEventListener
				&& !Ext.isOpera
				&& window.addEventListener("DOMFrameContentLoaded",
						implementation._DOMFrameReadyHandler, false);
		Ext.EventManager.on(window, "beforeunload", implementation.destroy,
				implementation);
		return implementation
	}();
	MIM = MIF.Manager;
	MIM.showDragMask = MIM.showShims;
	MIM.hideDragMask = MIM.hideShims;
	var winDD = Ext.Window.DD;
	Ext.override(winDD, {
		startDrag : winDD.prototype.startDrag.createInterceptor(MIM.showShims),
		endDrag : winDD.prototype.endDrag.createInterceptor(MIM.hideShims)
	});
	Ext.ux.ManagedIFramePanel = MIF.Panel;
	Ext.ux.ManagedIFramePortlet = MIF.Portlet;
	Ext.ux.ManagedIframe = function(el, opt) {
		var args = Array.prototype.slice.call(arguments, 0), el = Ext
				.get(args[0]), config = args[0];
		if (el && el.dom && el.dom.tagName == "IFRAME") {
			config = args[1] || {}
		} else {
			config = args[0] || args[1] || {};
			el = config.autoCreate ? Ext.get(Ext.DomHelper.append(
					config.autoCreate.parent || Ext.getBody(), Ext.apply( {
						tag : "iframe",
						frameborder : 0,
						cls : "x-mif",
						src : (Ext.isIE && Ext.isSecure) ? Ext.SSL_SECURE_URL
								: "about:blank"
					}, config.autoCreate))) : null;
			if (el && config.unsupportedText) {
				Ext.DomHelper.append(el.dom.parentNode, {
					tag : "noframes",
					html : config.unsupportedText
				})
			}
		}
		var mif = new MIF.Element(el, true);
		if (mif) {
			Ext.apply(mif, {
				disableMessaging : Ext.value(config.disableMessaging, true),
				focusOnLoad : Ext.value(config.focusOnLoad, Ext.isIE),
				eventsFollowFrameLinks : Ext.value(
						config.eventsFollowFrameLinks, true),
				loadMask : !!config.loadMask ? Ext.apply( {
					msg : "Loading..",
					msgCls : "x-mask-loading",
					maskEl : null,
					hideOnReady : false,
					disabled : false
				}, config.loadMask) : false,
				_windowContext : null
			});
			config.listeners && mif.on(config.listeners);
			if (!!config.html) {
				mif.update(config.html)
			} else {
				!!config.src && mif.setSrc(config.src)
			}
		}
		return mif
	};
	Ext.ux.ManagedIFrame.Error = Ext.extend(Ext.Error, {
		constructor : function(message, arg) {
			this.arg = arg;
			Ext.Error.call(this, message)
		},
		name : "Ext.ux.ManagedIFrame"
	});
	Ext
			.apply(
					Ext.ux.ManagedIFrame.Error.prototype,
					{
						lang : {
							"documentcontext-remove" : "An attempt was made to remove an Element from the wrong document context.",
							"execscript-secure-context" : "An attempt was made at script execution within a document context with limited access permissions.",
							printexception : "An Error was encountered attempting the print the frame contents (document access is likely restricted)."
						}
					});
	Ext
			.onReady(function() {
				var CSS = new Ext.ux.ManagedIFrame.CSS(document), rules = [];
				CSS.getRule(".ux-mif-fill")
						|| (rules.push(".ux-mif-fill{height:100%;width:100%;}"));
				CSS.getRule(".ux-mif-mask-target")
						|| (rules
								.push(".ux-mif-mask-target{position:relative;zoom:1;}"));
				CSS.getRule(".ux-mif-el-mask")
						|| (rules
								.push(
										".ux-mif-el-mask {z-index: 100;position: absolute;top:0;left:0;-moz-opacity: 0.5;opacity: .50;*filter: alpha(opacity=50);width: 100%;height: 100%;zoom: 1;} ",
										".ux-mif-el-mask-msg {z-index: 1;position: absolute;top: 0;left: 0;border:1px solid;background:repeat-x 0 -16px;padding:2px;} ",
										".ux-mif-el-mask-msg div {padding:5px 10px 5px 10px;border:1px solid;cursor:wait;} "));
				if (!CSS.getRule(".ux-mif-shim")) {
					rules
							.push(".ux-mif-shim {z-index:8500;position:absolute;top:0px;left:0px;background:transparent!important;overflow:hidden;display:none;}");
					rules
							.push(".ux-mif-shim-on{width:100%;height:100%;display:block;zoom:1;}");
					rules
							.push(".ext-ie6 .ux-mif-shim{margin-left:5px;margin-top:3px;}")
				}
				if (!CSS.getRule(".x-hide-nosize")) {
					rules
							.push(".x-hide-nosize{height:0px!important;width:0px!important;visibility:hidden!important;border:none!important;zoom:1;}.x-hide-nosize * {height:0px!important;width:0px!important;visibility:hidden!important;border:none!important;zoom:1;}")
				}
				!!rules.length
						&& CSS.createStyleSheet(rules.join(" "), "mifCSS")
			});
	Ext.provide && Ext.provide("mif")
})();