//Use an IIFE to simplify usage
let _anim = (function() {
	let animStyle = document.createElement("style");
	let animatedElements = [];
	let currentStyles = [], currentKeyframes = [], scrollElems = [];

	//Keep an object with animation data that cannot be touched by users
	let elementAnimations = new Map();

	let findingElements = false;

	let observer;

	const version = 0.1;
	
	//Add decoder to load
	function init(){
		//Add load listener
		window.addEventListener('DOMContentLoaded',	function() {
			findElements();
			addScrollListeners();
			scrollInit();

			document.head.appendChild(animStyle);

			//Create a mutation observer to monitor changes in attributes and new values to make sure new/changed elements are animated properly
			observer = new MutationObserver(domChanged);
			observer.observe(document, { attributes: true, childList: true, subtree: true });

			console.log("JSA v. " + version + " initialized. Visit https://github.com/CamSOlson/jsa for documentation");

		});
	}

	function domChanged(mutations){
		if (!findingElements){
			for (let e of mutations){
				if (e.target != undefined && e.target != null && e.target instanceof HTMLElement){
					if (e.type == "attributes" && e.attributeName == "data-animation"){
						addNewElement(e.target);		
					}else if (e.type == "childList"){
						for (let elem of e.addedNodes){
							if (elem instanceof HTMLElement && elem.hasAttribute("data-animation")){
								addNewElement(elem);
							}
						}
					}
				}
			}
		}
	}

	function addNewElement(elem){
		decodeStyles(elem);
		if (elem.dataset.animation.includes("scroll")){
			scrollElems.push(elem);
		}
		checkScrollPos();
	}

	//Collect all elements in page that are to be animated
	function findElements(){
		findingElements = true;

		animatedElements = document.querySelectorAll("*[data-animation]");
		scrollElems = [];
		for (let elem of animatedElements){
			decodeStyles(elem);
			if (elem.dataset.animation.includes("scroll")){
				scrollElems.push(elem);
			}
		}

		findingElements = false;
	}
	
	//Scroll-activated animations
	function addScrollListeners() {
		window.addEventListener('scroll', checkScrollPos);
		window.addEventListener('resize', scrollInit);
		checkScrollPos();
	}
						
	function scrollInit() {	
		addScrollListeners();
		checkScrollPos();
	}
	
	function checkScrollPos(){
		for (let elem of scrollElems) {
			let positionFromTop = elem.getBoundingClientRect().top;
			if (positionFromTop - window.innerHeight <= 0) {				
				//Loop through animations and add scroll-activated ones to the dataset
				for (let animation of elementAnimations.get(elem)){
					if (animation.activator == "scroll" && !elem.dataset.animation_active.includes(animation["name"])){
						elem.dataset.animation_active += animation["name"] + ";";
					}
				}
			}
		}
	}
	
	function decodeStyles(elem){
		if (elem.dataset.animation == undefined){
			return;
		}

		let attributes = elem.dataset.animation.split(";");
		
		//Keep an array of all animation objects
		let animations = [];

		//Create a new style element for the custom animation
		for (let attribute of attributes){
			//Modify the attribute to have no whitespace and CSS-safe characters
			attribute = attribute.replaceAll(/\s+/g, "").replaceAll(",", "|").replaceAll(".", "p");
			if (attribute == undefined || attribute == ""){
				break;
			}

			//Break off the type from the beginning via the parentheses
			let split = attribute.split("(");
			//If there are 2 elements in the split, continue
			if (split.length == 2){
				let type = split[0];
				let args = split[1].replaceAll(")", "").split("|");
				
				let keyframes = createKeyframes(type, args);
				
				if (!currentKeyframes.includes(keyframes["name"])){
					//Add keyframes to style
					animStyle.innerHTML += keyframes["data"] + "\n";
					currentKeyframes.push(keyframes["name"]);
				}
				
				/* GENERAL ARGUMENT KEY
					0: activator
					1: duration
					2: delay
				*/
				if (args[1] === undefined){
					args[1] = "0p5s";
				}
				args[1] = args[1].replaceAll("p", ".");
	
				if (args[2] === undefined){
					args[2] = "0s";
				}
				args[2] = args[2].replaceAll("p", ".");
	
				//Add to element animation data object
				animations.push({"name": attribute, "type": type, "activator": args[0], "args": args});
		
				//Create new class in stylesheet
				
				let style = "*[data-animation_active*='" + attribute + "']";
				if (!currentStyles.includes(style)){
					animStyle.innerHTML += style + "{" +
						`animation-name:${keyframes["name"]};` +
						`animation-duration:${args[1]};` +
						`animation-delay:${args[2]};`
						+ "}";
					currentStyles.push(style);
				}
			}
		}

		//Create an active version of the animation dataset to start and stop animations when necessary
		elem.dataset.animation_active = "";

		elementAnimations.set(elem, animations);
	}
	
	function createKeyframes(type, args){
		switch(type.toLowerCase()){
			default:
			case "fade":
				return createFadeKeyframes(args);
			case "slide": case "translate": case "move":
				return createSlideKeyframes(args);
		}
	}
	
	function createFadeKeyframes(args){
		/* ARGUMENT KEY
			3: start opacity
			4: end opacity
		*/ 
		let from = args[3] !== undefined ? args[3] : "0";
		let to = args[4] !== undefined ? args[4] : "1";
		let name = "fade-" + from + "-" + to;
		
		from = from.replace("p", ".");
		to = to.replace("p", ".");
		
		return {"name": name, "data": "@keyframes " + name + "{from{opacity: " + from + ";} to{opacity: " + to + ";}}"};
	}
	
	function createSlideKeyframes(args){
		/* ARGUMENT KEY
			3: direction
		*/
		let fromX = "-100";
		let toX = "0";
		let fromY = "0";
		let toY = "0";

		switch(args[3].toLowerCase()){
			default:
				args[3] = "left";
				break;
			case "top": case "down":
				fromX = "0";
				fromY = "-100";
				break;
			case "topright": case "downright":
				fromX = "100";
				fromY = "-100";
				break;
			case "right":
				fromX = "100";
				break;
			case "bottomright": case "upright":
				fromX = "100";
				fromY = "100";
				break;
			case "bottom": case "up":
				fromX = "0";
				fromY = "100";
				break;
			case "bottomleft": case "upleft":
				fromX = "-100";
				fromY = "100";
				break;
			case "topleft": case "downleft":
				fromX = "-100"
				fromY = "-100";
				break;
		}
		
		let name = "slide-dir-" + args[3];
		
		return {"name": name,
				"data": "@keyframes " + name + "{from{transform: translate(" +
					fromX + "vw, " + fromY + "vh);} to{transform: translate(" + toX + "vw, " + toY + "vh);}}"};
	}
	
	init();
})();

_anim;
window["_anim"] = _anim;