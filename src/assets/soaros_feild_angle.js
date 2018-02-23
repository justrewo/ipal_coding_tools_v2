/**
 * Created by zhengtang on 16-12-27.
 */
/**
 * Class for an editable angle field.
 * @param {string} text The initial content of the field.
 * @param {Function=} opt_validator An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns the accepted text or null to abort
 *     the change.
 * @extends {Blockly.FieldTextInput}
 * @constructor
 */

Blockly.Block.prototype.interpolate_ = function(message, args, lastDummyAlign) {
    var tokens = Blockly.utils.tokenizeInterpolation(message);
    // Interpolate the arguments.  Build a list of elements.
    var indexDup = [];
    var indexCount = 0;
    var elements = [];
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (typeof token == 'number') {
            goog.asserts.assert(token > 0 && token <= args.length,
                'Message index "%s" out of range.', token);
            goog.asserts.assert(!indexDup[token],
                'Message index "%s" duplicated.', token);
            indexDup[token] = true;
            indexCount++;
            elements.push(args[token - 1]);
        } else {
            token = token.trim();
            if (token) {
                elements.push(token);
            }
        }
    }
    goog.asserts.assert(indexCount == args.length,
        'Message does not reference all %s arg(s).', args.length);
    // Add last dummy input if needed.
    if (elements.length && (typeof elements[elements.length - 1] == 'string' ||
        goog.string.startsWith(elements[elements.length - 1]['type'],
            'field_'))) {
        var dummyInput = {type: 'input_dummy'};
        if (lastDummyAlign) {
            dummyInput['align'] = lastDummyAlign;
        }
        elements.push(dummyInput);
    }
    // Lookup of alignment constants.
    var alignmentLookup = {
        'LEFT': Blockly.ALIGN_LEFT,
        'RIGHT': Blockly.ALIGN_RIGHT,
        'CENTRE': Blockly.ALIGN_CENTRE
    };
    // Populate block with inputs and fields.
    var fieldStack = [];
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (typeof element == 'string') {
            fieldStack.push([element, undefined]);
        } else {
            var field = null;
            var input = null;
            do {
                var altRepeat = false;
                if (typeof element == 'string') {
                    field = new Blockly.FieldLabel(element);
                } else {
                    switch (element['type']) {
                        case 'input_value':
                            input = this.appendValueInput(element['name']);
                            break;
                        case 'input_statement':
                            input = this.appendStatementInput(element['name']);
                            break;
                        case 'input_dummy':
                            input = this.appendDummyInput(element['name']);
                            break;
                        case 'field_label':
                            field = new Blockly.FieldLabel(element['text'], element['class']);
                            break;
                        case 'field_input':
                            field = new Blockly.FieldTextInput(element['text']);
                            if (typeof element['spellcheck'] == 'boolean') {
                                field.setSpellcheck(element['spellcheck']);
                            }
                            break;
                        case 'field_angle':
                            field = new Blockly.FieldAngle(element['angle'],element['min'], element['max']);
                            break;
                        case 'field_checkbox':
                            field = new Blockly.FieldCheckbox(
                                element['checked'] ? 'TRUE' : 'FALSE');
                            break;
                        case 'field_colour':
                            field = new Blockly.FieldColour(element['colour']);
                            break;
                        case 'field_variable':
                            field = new Blockly.FieldVariable(element['variable']);
                            break;
                        case 'field_dropdown':
                            console.log(element['options']);
                            field = new Blockly.FieldDropdown(element['options']);
                            break;
                        case 'field_image':
                            field = new Blockly.FieldImage(element['src'],
                                element['width'], element['height'], element['alt']);
                            break;
                        case 'field_imagebutton':
                            field = new Blockly.FieldImageButton(element['src'],
                                element['width'], element['height'], element['alt']);
                            break;
                        case 'field_number':
                            field = new Blockly.FieldNumber(element['value'],
                                element['min'], element['max'], element['precision']);
                            break;
                        case 'field_date':
                            if (Blockly.FieldDate) {
                                field = new Blockly.FieldDate(element['date']);
                                break;
                            }
                        // Fall through if FieldDate is not compiled in.
                        default:
                            // Unknown field.
                            if (element['alt']) {
                                element = element['alt'];
                                altRepeat = true;
                            }
                    }
                }
            } while (altRepeat);
            if (field) {
                fieldStack.push([field, element['name']]);
            } else if (input) {
                if (element['check']) {
                    input.setCheck(element['check']);
                }
                if (element['align']) {
                    input.setAlign(alignmentLookup[element['align']]);
                }
                for (var j = 0; j < fieldStack.length; j++) {
                    input.appendField(fieldStack[j][0], fieldStack[j][1]);
                }
                fieldStack.length = 0;
            }
        }
    }
};


Blockly.FieldAngle = function(opt_value, opt_min, opt_max, opt_validator) {
    // Add degree symbol: "360°" (LTR) or "°360" (RTL)
    this.symbol_ = Blockly.utils.createSvgElement('tspan', {}, null);
    //this.symbol_.appendChild(document.createTextNode('\u00B0'));
    if (opt_max-opt_min <= 360) {
        this.max = opt_max + 1;
        this.min = opt_min;
    }
    else
    {
        this.max = opt_max;
        this.min = opt_min;
    }

	opt_value = (opt_value && !isNaN(opt_value)) ? String(opt_value) : '0';
	Blockly.FieldAngle.superClass_.constructor.call(
		this, opt_value, opt_min, opt_max, opt_validator);

};
goog.inherits(Blockly.FieldAngle, Blockly.FieldNumber);

/**
 * Round angles to the nearest 15 degrees when using mouse.
 * Set to 0 to disable rounding.
 */
Blockly.FieldAngle.ROUND = 1;

/**
 * Half the width of protractor image.
 */
Blockly.FieldAngle.HALF = 100 / 2;

/* The following two settings work together to set the behaviour of the angle
 * picker.  While many combinations are possible, two modes are typical:
 * Math mode.
 *   0 deg is right, 90 is up.  This is the style used by protractors.
 *   Blockly.FieldAngle.CLOCKWISE = false;
 *   Blockly.FieldAngle.OFFSET = 0;
 * Compass mode.
 *   0 deg is up, 90 is right.  This is the style used by maps.
 *   Blockly.FieldAngle.CLOCKWISE = true;
 *   Blockly.FieldAngle.OFFSET = 90;
 */

/**
 * Angle increases clockwise (true) or counterclockwise (false).
 */
Blockly.FieldAngle.CLOCKWISE = false;

/**
 * Offset the location of 0 degrees (and all angles) by a constant.
 * Usually either 0 (0 = right) or 90 (0 = up).
 */
Blockly.FieldAngle.OFFSET = 0;

/**
 * Maximum allowed angle before wrapping.
 * Usually either 360 (for 0 to 359.9) or 180 (for -179.9 to 180).
 */
Blockly.FieldAngle.WRAP = 360;


/**
 * Radius of protractor circle.  Slightly smaller than protractor size since
 * otherwise SVG crops off half the border at the edges.
 */
Blockly.FieldAngle.RADIUS = Blockly.FieldAngle.HALF - 1;

/**
 * Show the inline free-text editor on top of the text.
 * @private
 */
Blockly.FieldAngle.prototype.showEditor_ = function() {
    var noFocus =
        goog.userAgent.MOBILE || goog.userAgent.ANDROID || goog.userAgent.IPAD;
    // Mobile browsers have issues with in-line textareas (focus & keyboards).
    Blockly.FieldAngle.superClass_.showEditor_.call(this, noFocus);
    var div = Blockly.WidgetDiv.DIV;
    if (!div.firstChild) {
        // Mobile interface uses Blockly.prompt.
        return;
    }
    // Build the SVG DOM.
    var svg = Blockly.utils.createSvgElement('svg', {
        'xmlns': 'http://www.w3.org/2000/svg',
        'xmlns:html': 'http://www.w3.org/1999/xhtml',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        'version': '1.1',
        'height': (Blockly.FieldAngle.HALF * 2) + 'px',
        'width': (Blockly.FieldAngle.HALF * 2) + 'px'
    }, div);
    var circle = Blockly.utils.createSvgElement('circle', {
        'cx': Blockly.FieldAngle.HALF, 'cy': Blockly.FieldAngle.HALF,
        'r': Blockly.FieldAngle.RADIUS,
        'class': 'blocklyAngleCircle'
    }, svg);
    this.gauge_ = Blockly.utils.createSvgElement('path',
        {'class': 'blocklyAngleGauge'}, svg);
    this.line_ = Blockly.utils.createSvgElement('line',
        {'x1': Blockly.FieldAngle.HALF,
            'y1': Blockly.FieldAngle.HALF,
            'class': 'blocklyAngleLine'}, svg);
    // Draw markers around the edge.
    for (var angle = 0; angle < 360; angle += 45) {
        Blockly.utils.createSvgElement('line', {
            'x1': Blockly.FieldAngle.HALF + Blockly.FieldAngle.RADIUS,
            'y1': Blockly.FieldAngle.HALF,
            'x2': Blockly.FieldAngle.HALF + Blockly.FieldAngle.RADIUS -
            (angle % 45 == 0 ? 10 : 5),
            'y2': Blockly.FieldAngle.HALF,
            'class': 'blocklyAngleMarks',
            'transform': 'rotate(' + angle + ',' +
            Blockly.FieldAngle.HALF + ',' + Blockly.FieldAngle.HALF + ')'
        }, svg);
    }
    svg.style.marginLeft = (15 - Blockly.FieldAngle.RADIUS) + 'px';

    // The angle picker is different from other fields in that it updates on
    // mousemove even if it's not in the middle of a drag.  In future we may
    // change this behavior.  For now, using bindEvent_ instead of
    // bindEventWithChecks_ allows it to work without a mousedown/touchstart.
    this.clickWrapper_ =
        Blockly.bindEvent_(svg, 'click', this, Blockly.WidgetDiv.hide);
    this.moveWrapper1_ =
        Blockly.bindEvent_(circle, 'mousemove', this, this.onMouseMove);
    this.moveWrapper2_ =
        Blockly.bindEvent_(this.gauge_, 'mousemove', this,
            this.onMouseMove);
    this.updateGraph_();
};

/**
 * Set the angle to match the mouse's position.
 * @param {!Event} e Mouse move event.
 */
Blockly.FieldAngle.prototype.onMouseMove = function(e) {
    var bBox = this.gauge_.ownerSVGElement.getBoundingClientRect();
    var dx = e.clientX - bBox.left - Blockly.FieldAngle.HALF;
    var dy = e.clientY - bBox.top - Blockly.FieldAngle.HALF;
    var angle = Math.atan(-dy / dx);
    if (isNaN(angle)) {
        // This shouldn't happen, but let's not let this error propogate further.
        return;
    }
    angle = goog.math.toDegrees(angle);

    // 0: East, 90: North, 180: West, 270: South.
    if (dx < 0) {
        angle += 180;
    } else if (dy > 0) {
        angle += 360;
    }
    if (Blockly.FieldAngle.CLOCKWISE) {
        angle = Blockly.FieldAngle.OFFSET + 360 - angle;
    } else {
        angle -= Blockly.FieldAngle.OFFSET;
    }
    if (Blockly.FieldAngle.ROUND) {
        angle = Math.round(angle / Blockly.FieldAngle.ROUND) *
            Blockly.FieldAngle.ROUND;
    }
//    angle = this.callValidator(angle);

    this.angleincircle = angle;

    angle = Math.round(angle*(this.max-this.min)/360) + this.min;
    if (this.max-this.min<360 && angle > this.max-1)
    {
        angle = this.max-1;
    }
    /*if (Blockly.FieldAngle.ROUND) {
        angle = Math.round(angle / Blockly.FieldAngle.ROUND) *
            Blockly.FieldAngle.ROUND;
    }*/
    angle = this.callValidator(angle);
    Blockly.FieldTextInput.htmlInput_.value = angle;
    this.setValue(angle);
    this.validate_();
    this.resizeEditor_();
};

/**
 * Insert a degree symbol.
 * @param {?string} text New text.
 */
Blockly.FieldAngle.prototype.setText = function(text) {
    Blockly.FieldAngle.superClass_.setText.call(this, text);
    if (!this.textElement_) {
        // Not rendered yet.
        return;
    }
    this.updateGraph_();
    // Insert degree symbol.
    // Cached width is obsolete.  Clear it.
    this.size_.width = 0;
};

/**
 * Redraw the graph with the current angle.
 * @private
 */
Blockly.FieldAngle.prototype.updateGraph_ = function() {
    if (!this.gauge_) {
        return;
    }
    var angleDegrees = Number(this.angleincircle) + Blockly.FieldAngle.OFFSET;
    var angleRadians = goog.math.toRadians(angleDegrees);
    var path = ['M ', Blockly.FieldAngle.HALF, ',', Blockly.FieldAngle.HALF];
    var x2 = Blockly.FieldAngle.HALF;
    var y2 = Blockly.FieldAngle.HALF;
    if (!isNaN(angleRadians)) {
        var angle1 = goog.math.toRadians(Blockly.FieldAngle.OFFSET);
        var x1 = Math.cos(angle1) * Blockly.FieldAngle.RADIUS;
        var y1 = Math.sin(angle1) * -Blockly.FieldAngle.RADIUS;
        if (Blockly.FieldAngle.CLOCKWISE) {
            angleRadians = 2 * angle1 - angleRadians;
        }
        x2 += Math.cos(angleRadians) * Blockly.FieldAngle.RADIUS;
        y2 -= Math.sin(angleRadians) * Blockly.FieldAngle.RADIUS;
        // Don't ask how the flag calculations work.  They just do.
        var largeFlag = Math.abs(Math.floor((angleRadians - angle1) / Math.PI) % 2);
        if (Blockly.FieldAngle.CLOCKWISE) {
            largeFlag = 1 - largeFlag;
        }
        var sweepFlag = Number(Blockly.FieldAngle.CLOCKWISE);
        path.push(' l ', x1, ',', y1,
            ' A ', Blockly.FieldAngle.RADIUS, ',', Blockly.FieldAngle.RADIUS,
            ' 0 ', largeFlag, ' ', sweepFlag, ' ', x2, ',', y2, ' z');
    }
    this.gauge_.setAttribute('d', path.join(''));
    this.line_.setAttribute('x2', x2);
    this.line_.setAttribute('y2', y2);
};

/**
 * Ensure that only an angle may be entered.
 * @param {string} text The user's text.
 * @return {?string} A string representing a valid angle, or null if invalid.
 */
Blockly.FieldAngle.prototype.classValidator = function(text) {
    if (text === null) {
        return null;
    }
    var n = parseFloat(text || 0);
    if (isNaN(n)) {
        return null;
    }
   /* n = n % 360;
    if (n < 0) {
        n += 360;
    }
    if (n > Blockly.FieldAngle.WRAP) {
        n -= 360;
    }*/
    return String(n);
};

Blockly.Field.prototype.onMouseUp_ = function(e) {
    if ((goog.userAgent.IPHONE || goog.userAgent.IPAD) &&
        !goog.userAgent.isVersionOrHigher('537.51.2') &&
        e.layerX !== 0 && e.layerY !== 0) {
        // Old iOS spawns a bogus event on the next touch after a 'prompt()' edit.
        // Unlike the real events, these have a layerX and layerY set.
        return;
    } else if (Blockly.isRightButton(e)) {
        // Right-click.
        return;
    } else if (this.sourceBlock_.workspace.isDragging()) {
        // Drag operation is concluding.  Don't open the editor.
        return;
    } else if (this.sourceBlock_.isInFlyout) {
        // Drag operation in toolbox.  Don't open the editor.
        return;
    } else if (this.sourceBlock_.isEditable()) {
        // Non-abstract sub-classes must define a showEditor_ method.
        this.showEditor_();
        // The field is handling the touch, but we also want the blockSvg onMouseUp
        // handler to fire, so we will leave the touch identifier as it is.
        // The next onMouseUp is responsible for nulling it out.
    }
};

Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
	// Block for variable getter.
	{
		"type": "variables_get",
		"message0": "%1",
		"args0": [
			{
				"type": "field_variable",
				"name": "VAR",
				"variable": "a"
			}
		],
		"output": null,
		"colour": "%{BKY_VARIABLES_HUE}",
		"helpUrl": "%{BKY_VARIABLES_GET_HELPURL}",
		"tooltip": "%{BKY_VARIABLES_GET_TOOLTIP}",
		"extensions": ["contextMenu_variableSetterGetter"]
	},
	// Block for variable setter.
	{
		"type": "variables_set",
		"message0": "%{BKY_VARIABLES_SET}",
		"args0": [
			{
				"type": "field_variable",
				"name": "VAR",
				"variable": "a"
			},
			{
				"type": "input_value",
				"name": "VALUE"
			}
		],
		"previousStatement": null,
		"nextStatement": null,
		"colour": "%{BKY_VARIABLES_HUE}",
		"tooltip": "%{BKY_VARIABLES_SET_TOOLTIP}",
		"helpUrl": "%{BKY_VARIABLES_SET_HELPURL}",
		"extensions": ["contextMenu_variableSetterGetter"]
	}
]);


Blockly.NEW_VARIABLE_ID = 'NEW_VARIABLE_ID';


Blockly.FieldVariable.dropdownCreate = function () {
	var variableModelList = [];
	var name = this.getText();
	// Don't create a new variable if there is nothing selected.
	var createSelectedVariable = name ? true : false;
	var workspace = null;
	if (this.sourceBlock_) {
		workspace = this.sourceBlock_.workspace;
	}
	if (workspace) {
		var variableTypes = this.getVariableTypes_();
		var variableModelList = [];
		// Get a copy of the list, so that adding rename and new variable options
		// doesn't modify the workspace's list.
		for (var i = 0; i < variableTypes.length; i++) {
			var variableType = variableTypes[i];
			var variables = workspace.getVariablesOfType(variableType);
			variableModelList = variableModelList.concat(variables);
		}
		for (var i = 0; i < variableModelList.length; i++) {
			if (createSelectedVariable &&
				goog.string.caseInsensitiveEquals(variableModelList[i].name, name)) {
				createSelectedVariable = false;
				break;
			}
		}
	}
	// Ensure that the currently selected variable is an option.
	if (createSelectedVariable && workspace) {
		var newVar = workspace.createVariable(name);
		variableModelList.push(newVar);
	}
	variableModelList.sort(Blockly.VariableModel.compareByName);
	var options = [];
	for (var i = 0; i < variableModelList.length; i++) {
		// Set the uuid as the internal representation of the variable.
		options[i] = [variableModelList[i].name, variableModelList[i].getId()];
	}
	options.push([Blockly.Msg.NEW_VARIABLE, Blockly.NEW_VARIABLE_ID]);

	options.push([Blockly.Msg.RENAME_VARIABLE, Blockly.RENAME_VARIABLE_ID]);
	if (Blockly.Msg.DELETE_VARIABLE) {
		options.push([Blockly.Msg.DELETE_VARIABLE.replace('%1', name),
			Blockly.DELETE_VARIABLE_ID]);
	}
	return options;
};

/**
 * Handle the selection of an item in the variable dropdown menu.
 * Special case the 'Rename variable...' and 'Delete variable...' options.
 * In the rename case, prompt the user for a new name.
 * @param {!goog.ui.Menu} menu The Menu component clicked.
 * @param {!goog.ui.MenuItem} menuItem The MenuItem selected within menu.
 */
Blockly.FieldVariable.prototype.onItemSelected = function (menu, menuItem) {
	var id = menuItem.getValue();
	// TODO(marisaleung): change setValue() to take in an id as the parameter.
	// Then remove itemText.
	var itemText;
	if (this.sourceBlock_ && this.sourceBlock_.workspace) {
		var workspace = this.sourceBlock_.workspace;
		var variable = workspace.getVariableById(id);
		// If the item selected is a variable, set itemText to the variable name.
		if (variable) {
			itemText = variable.name;
		}
		else if (id == Blockly.RENAME_VARIABLE_ID) {
			// Rename variable.
			var currentName = this.getText();
			variable = workspace.getVariable(currentName);
			Blockly.Variables.renameVariable(workspace, variable);
			return;
		} else if (id == Blockly.DELETE_VARIABLE_ID) {
			// Delete variable.
			workspace.deleteVariable(this.getText());
			return;
		}
		else if (id == Blockly.NEW_VARIABLE_ID) {
			// new variable.
			Blockly.Variables.createVariable(workspace);
			return;
		}

		// Call any validation function, and allow it to override.
		itemText = this.callValidator(itemText);
	}
	if (itemText !== null) {
		this.setValue(itemText);
	}
};


