/**
 * Created by zhengtang on 17-1-11.
 */

Blockly.Xml.subWorkspaceToDom = function (workspace, opt_noId) {
    var xml = goog.dom.createDom('xml');
    var blocks = workspace.getTopBlocks(true);
    for (var i = 0, block; block = blocks[i]; i++) {
        //console.log(block.type);
        if (block.type == "robot_control_start") {
            block = block.getNextBlock();
        }
        else {
            continue;
        }
        if (block != null) {
            xml.appendChild(Blockly.Xml.subBlockToDomWithXY(block, opt_noId));
        }
        else {
            return null;
        }
    }
    return xml;
};

Blockly.Xml.subDomToText = function (dom) {
    var oSerializer = new XMLSerializer();
    return oSerializer.serializeToString(dom);
};

/**
 * Converts a DOM structure into properly indented text.
 * @param {!Element} dom A tree of XML elements.
 * @return {string} Text representation.
 */
Blockly.Xml.subDomToPrettyText = function (dom) {
    // This function is not guaranteed to be correct for all XML.
    // But it handles the XML that Blockly generates.
    var blob = Blockly.Xml.subDomToText(dom);
    // Place every open and close tag on its own line.
    var lines = blob.split('<');
    // Indent every line.
    var indent = '';
    for (var i = 1; i < lines.length; i++) {
        var line = lines[i];
        if (line[0] == '/') {
            indent = indent.substring(2);
        }
        lines[i] = indent + '<' + line;
        if (line[0] != '/' && line.slice(-2) != '/>') {
            indent += '  ';
        }
    }
    // Pull simple tags back together.
    // E.g. <foo></foo>
    var text = lines.join('\n');
    text = text.replace(/(<(\w+)\b[^>]*>[^\n]*)\n *<\/\2>/g, '$1</$2>');
    // Trim leading blank line.
    return text.replace(/^\n/, '');
};

Blockly.Xml.subBlockToDomWithXY = function (block, opt_noId) {
    var width;  // Not used in LTR.
    if (block.workspace.RTL) {
        width = block.workspace.getWidth();
    }
    var element = Blockly.Xml.subBlockToDom(block, opt_noId);
    if (block.type != "robot_control_start") {
        var xy = block.getRelativeToSurfaceXY();
        element.setAttribute('x',
            Math.round(block.workspace.RTL ? width - xy.x : xy.x));
        element.setAttribute('y', Math.round(xy.y));
    }
    return element;
};

Blockly.Xml.subBlockToDom = function (block, opt_noId) {
    var element = goog.dom.createDom(block.isShadow() ? 'shadow' : 'block');
    if (block.type != "robot_control_start") {
        element.setAttribute('type', block.type);
        if (!opt_noId) {
            element.setAttribute('id', block.id);
        }
        if (block.mutationToDom) {
            // Custom data for an advanced block.
            var mutation = block.mutationToDom();
            if (mutation && (mutation.hasChildNodes() || mutation.hasAttributes())) {
                element.appendChild(mutation);
            }
        }
        function fieldToDom(field) {
            if (field.name && field.EDITABLE) {
                var container = goog.dom.createDom('field', null, field.getValue());
                container.setAttribute('name', field.name);
                element.appendChild(container);
            }
        }

        for (var i = 0, input; input = block.inputList[i]; i++) {
            for (var j = 0, field; field = input.fieldRow[j]; j++) {
                fieldToDom(field);
            }
        }

        var commentText = block.getCommentText();
        if (commentText) {
            var commentElement = goog.dom.createDom('comment', null, commentText);
            if (typeof block.comment == 'object') {
                commentElement.setAttribute('pinned', block.comment.isVisible());
                var hw = block.comment.getBubbleSize();
                commentElement.setAttribute('h', hw.height);
                commentElement.setAttribute('w', hw.width);
            }
            element.appendChild(commentElement);
        }

        if (block.data) {
            var dataElement = goog.dom.createDom('data', null, block.data);
            element.appendChild(dataElement);
        }

        for (var i = 0, input; input = block.inputList[i]; i++) {
            var container;
            var empty = true;
            if (input.type == Blockly.DUMMY_INPUT) {
                continue;
            } else {
                var childBlock = input.connection.targetBlock();
                if (input.type == Blockly.INPUT_VALUE) {
                    container = goog.dom.createDom('value');
                } else if (input.type == Blockly.NEXT_STATEMENT) {
                    container = goog.dom.createDom('statement');
                }
                var shadow = input.connection.getShadowDom();
                if (shadow && (!childBlock || !childBlock.isShadow())) {
                    container.appendChild(Blockly.Xml.cloneShadow_(shadow));
                }
                if (childBlock) {
                    container.appendChild(Blockly.Xml.blockToDom(childBlock, opt_noId));
                    empty = false;
                }
            }
            container.setAttribute('name', input.name);
            if (!empty) {
                element.appendChild(container);
            }
        }
        if (block.inputsInlineDefault != block.inputsInline) {
            element.setAttribute('inline', block.inputsInline);
        }
        if (block.isCollapsed()) {
            element.setAttribute('collapsed', true);
        }
        if (block.disabled) {
            element.setAttribute('disabled', true);
        }
        if (!block.isDeletable() && !block.isShadow()) {
            element.setAttribute('deletable', false);
        }
        if (!block.isMovable() && !block.isShadow()) {
            element.setAttribute('movable', false);
        }
        if (!block.isEditable()) {
            element.setAttribute('editable', false);
        }
    }

    var nextBlock = block.getNextBlock();
    if (nextBlock) {
        var container = goog.dom.createDom('next', null,
            Blockly.Xml.subBlockToDom(nextBlock, opt_noId));
        element.appendChild(container);
    }
    var shadow = block.nextConnection && block.nextConnection.getShadowDom();
    if (shadow && (!nextBlock || !nextBlock.isShadow())) {
        container.appendChild(Blockly.Xml.cloneShadow_(shadow));
    }

    return element;
};

Blockly.Generator.prototype.workspaceToCode = function (workspace) {
	if (!workspace) {
		// Backwards compatibility from before there could be multiple workspaces.
		console.warn('No workspace specified in workspaceToCode call.  Guessing.');
		workspace = Blockly.getMainWorkspace();
	}
	var code = [];
	this.init(workspace);
	var blocks = workspace.getTopBlocks(true);
	for (var x = 0, block; block = blocks[x]; x++) {
		var line = this.blockToCode(block);
		if (goog.isArray(line)) {
			// Value blocks return tuples of code and operator order.
			// Top-level blocks don't care about operator order.
			line = line[0];
		}
		if (line) {
			if (block.outputConnection && this.scrubNakedValue) {
				// This block is a naked value.  Ask the language's code generator if
				// it wants to append a semicolon, or something.
				line = this.scrubNakedValue(line);
			}
			code.push(line);
		}
	}
	code = code.join('}\n');  // Blank line between each section.
	code = code + '}\n';  // Blank line between each section.
	code = this.finish(code);
	// Final scrubbing of whitespace.
	code = code.replace(/^\s+\n/, '');
	code = code.replace(/\n\s+$/, '\n');
	code = code.replace(/[ \t]+\n/g, '\n');
	return code;
};

Blockly.init_ = function(mainWorkspace) {
    var options = mainWorkspace.options;
    var svg = mainWorkspace.getParentSvg();

    // Supress the browser's context menu.
    Blockly.bindEventWithChecks_(svg, 'contextmenu', null,
        function(e) {
            if (!Blockly.isTargetInput_(e)) {
                e.preventDefault();
            }
        });

    var workspaceResizeHandler = Blockly.bindEventWithChecks_(window, 'resize',
        null,
        function() {
            Blockly.hideChaff(true);
            Blockly.svgResize(mainWorkspace);
        });
    mainWorkspace.setResizeHandlerWrapper(workspaceResizeHandler);

    Blockly.inject.bindDocumentEvents_();

    if (options.languageTree) {
        if (mainWorkspace.toolbox_) {
            mainWorkspace.toolbox_.init(mainWorkspace);
        } else if (mainWorkspace.flyout_) {
            // Build a fixed flyout with the root blocks.
            mainWorkspace.flyout_.init(mainWorkspace);
            //mainWorkspace.flyout_.show(options.languageTree.childNodes);
            mainWorkspace.flyout_.scrollToStart();
            //Translate the workspace sideways to avoid the fixed flyout.
            mainWorkspace.scrollX = mainWorkspace.flyout_.width_;
            if (options.toolboxPosition == Blockly.TOOLBOX_AT_RIGHT) {
                mainWorkspace.scrollX *= -1;
            }
            mainWorkspace.translate(mainWorkspace.scrollX, 0);
        }
    }

    if (options.hasScrollbars) {
        mainWorkspace.scrollbar = new Blockly.ScrollbarPair(mainWorkspace);
        mainWorkspace.scrollbar.resize();
    }

    // Load the sounds.
    if (options.hasSounds) {
        Blockly.inject.loadSounds_(options.pathToMedia, mainWorkspace);
    }
};

Blockly.WorkspaceSvg.prototype.addFlyout_ = function(tagName) {
	var workspaceOptions = {
		disabledPatternId: this.options.disabledPatternId,
		parentWorkspace: this,
		RTL: this.RTL,
		oneBasedIndex: this.options.oneBasedIndex,
		horizontalLayout: this.horizontalLayout,
		toolboxPosition: this.options.toolboxPosition
	};
	/**
	 * @type {!Blockly.Flyout}
	 * @private
	 */
	this.flyout_ = null;
	if (this.horizontalLayout) {
		this.flyout_ = new Blockly.HorizontalFlyout(workspaceOptions);
	} else {
		this.flyout_ = new Blockly.VerticalFlyout(workspaceOptions);
	}
	/*if(tagName == "svg") {
		this.flyout_.autoClose = true;
	}
	else*/
	{
		this.flyout_.autoClose = false;
	}

	// Return the element  so that callers can place it in their desired
	// spot in the dom.  For exmaple, mutator flyouts do not go in the same place
	// as main workspace flyouts.
	return this.flyout_.createDom(tagName);
};

Blockly.ZoomControls.prototype.createDom = function() {
	var workspace = this.workspace_;
	/* Here's the markup that will be generated:
	 <g class="blocklyZoom">
	 <clippath id="blocklyZoomoutClipPath837493">
	 <rect width="32" height="32" y="77"></rect>
	 </clippath>
	 <image width="96" height="124" x="-64" y="-15" xlink:href="media/sprites.png"
	 clip-path="url(#blocklyZoomoutClipPath837493)"></image>
	 <clippath id="blocklyZoominClipPath837493">
	 <rect width="32" height="32" y="43"></rect>
	 </clippath>
	 <image width="96" height="124" x="-32" y="-49" xlink:href="media/sprites.png"
	 clip-path="url(#blocklyZoominClipPath837493)"></image>
	 <clippath id="blocklyZoomresetClipPath837493">
	 <rect width="32" height="32"></rect>
	 </clippath>
	 <image width="96" height="124" y="-92" xlink:href="media/sprites.png"
	 clip-path="url(#blocklyZoomresetClipPath837493)"></image>
	 </g>
	 */
	this.svgGroup_ = Blockly.utils.createSvgElement('g',
		{'class': 'blocklyZoom'}, null);
	var clip;
	var rnd = String(Math.random()).substring(2);

	clip = Blockly.utils.createSvgElement('clipPath',
		{'id': 'blocklyZoomoutClipPath' + rnd},
		this.svgGroup_);
	Blockly.utils.createSvgElement('rect',
		{'width': 32, 'height': 32, 'y': 77},
		clip);
	var zoomoutSvg = Blockly.utils.createSvgElement('image',
		{'width': Blockly.SPRITE.width,
			'height': Blockly.SPRITE.height, 'x': -64,
			'y': -15,
			'clip-path': 'url(#blocklyZoomoutClipPath' + rnd + ')'},
		this.svgGroup_);
	zoomoutSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
		workspace.options.pathToMedia + Blockly.SPRITE.url);

	clip = Blockly.utils.createSvgElement('clipPath',
		{'id': 'blocklyZoominClipPath' + rnd},
		this.svgGroup_);
	Blockly.utils.createSvgElement('rect',
		{'width': 32, 'height': 32, 'y': 43},
		clip);
	var zoominSvg = Blockly.utils.createSvgElement('image',
		{'width': Blockly.SPRITE.width,
			'height': Blockly.SPRITE.height,
			'x': -32,
			'y': -49,
			'clip-path': 'url(#blocklyZoominClipPath' + rnd + ')'},
		this.svgGroup_);
	zoominSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
		workspace.options.pathToMedia + Blockly.SPRITE.url);

	clip = Blockly.utils.createSvgElement('clipPath',
		{'id': 'blocklyZoomresetClipPath' + rnd},
		this.svgGroup_);
	Blockly.utils.createSvgElement('rect',
		{'width': 32, 'height': 32},
		clip);
	var zoomresetSvg = Blockly.utils.createSvgElement('image',
		{'width': Blockly.SPRITE.width,
			'height': Blockly.SPRITE.height, 'y': -92,
			'clip-path': 'url(#blocklyZoomresetClipPath' + rnd + ')'},
		this.svgGroup_);
	zoomresetSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
		workspace.options.pathToMedia + Blockly.SPRITE.url);

	// Attach event listeners.
	Blockly.bindEventWithChecks_(zoomresetSvg, 'mousedown', null, function(e) {
		workspace.markFocused();
		workspace.setScale(workspace.options.zoomOptions.startScale);
//		workspace.scrollCenter();
		Blockly.Touch.clearTouchIdentifier();  // Don't block future drags.
		e.stopPropagation();  // Don't start a workspace scroll.
		e.preventDefault();  // Stop double-clicking from selecting text.
	});
	Blockly.bindEventWithChecks_(zoominSvg, 'mousedown', null, function(e) {
		workspace.markFocused();
		workspace.zoomCenter(1);
		Blockly.Touch.clearTouchIdentifier();  // Don't block future drags.
		e.stopPropagation();  // Don't start a workspace scroll.
		e.preventDefault();  // Stop double-clicking from selecting text.
	});
	Blockly.bindEventWithChecks_(zoomoutSvg, 'mousedown', null, function(e) {
		workspace.markFocused();
		workspace.zoomCenter(-1);
		Blockly.Touch.clearTouchIdentifier();  // Don't block future drags.
		e.stopPropagation();  // Don't start a workspace scroll.
		e.preventDefault();  // Stop double-clicking from selecting text.
	});

	return this.svgGroup_;
};

