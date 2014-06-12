/**
 * Created by wangsheng on 1/6/14.
 */

/**
 * Implements some methods that are shared across many different Data types.
 * @constructor
 */
function Data(){
    this.svg = document.querySelector("#svg-playground");
}

/**
 * show the tip. This type of tip is the typical type that a basic line linear chart uses.
 * @param dataX
 * @param dataY
 * @param pixelX
 * @param pixelY
 */
Data.prototype.showTip = function(dataX, dataY, pixelX, pixelY, seriesName, color){
    //change the text content accordingly.
    this.tip.text.ws_seriesName.textContent = seriesName;
    this.tip.text.ws_valuesLabel.textContent = dataX + " - ";
    this.tip.text.ws_valuesData.textContent = dataY;

    //center the text.
    var width = this.tip.text.getBBox().width;
    this.tip.text.setAttributeNS(null, "x", -width/2);
    this.tip.text.ws_valuesLabel.setAttributeNS(null, "x", -width/2); //value lable needs to be aligned to the left.

    //change the size of the talk bubble.
    var dArray = this.tip.talkBubble.dArray;
    dArray[4] = dArray[6] = -10 - (width / 2); //adjust the coordinates of the left edge.
    dArray[8] = dArray[10] = 10 + (width / 2); //adjust the coordinates of the right edge.

    //shift the talk bubble left or right if there is not enough room to display it.
    var distance = dArray[4] + pixelX - this.xDrawInfo.chartDisplayLeftEdgeX;
    if(distance < 0) {
        dArray[4] = dArray[6] = dArray[4] - distance; //distance is negative...
        dArray[8] = dArray[10] = dArray[8] - distance;
        this.tip.text.setAttributeNS(null, "x", -width/2 - distance);
        this.tip.text.ws_valuesLabel.setAttributeNS(null, "x", -width/2 - distance);
    }
    distance = dArray[8] + pixelX - this.xDrawInfo.chartDisplayRightEdgeX;
    if(distance > 0){
        dArray[4] = dArray[6] = dArray[4] - distance;
        dArray[8] = dArray[10] = dArray[8] - distance;
        this.tip.text.setAttributeNS(null, "x", -width/2 - distance);
        this.tip.text.ws_valuesLabel.setAttributeNS(null, "x", -width/2 - distance);
    }

    var d = "M" + dArray.join(" ") + "Z";
    this.tip.talkBubble.setAttributeNS(null, "d", d);

    //change the outline color of the talk bubble.
    draw.setStrokeFill(this.tip.talkBubble, color.strokeColor, false, false);

    //translate the whole group so that it sits above the target node.
    draw.translate(this.tip.group, pixelX, pixelY);
    draw.setVisibility(this.tip.group, true);
};

/**
 * hide the tip.
 */
Data.prototype.hideTip = function(){
    draw.setVisibility(this.tip.group, false);
};

/**
 * draw the tip template. This type of tip is the typical type that a basic line linear chart uses
 */
Data.prototype.drawTipTemplate = function(){
    var group = draw.createGroup();
    draw.setVisibility(group, false);
    var talkBubble = this.drawTipTempalte_talkBubble(group);
    var text = this.drawTipTemplate_text(group);
    this.svg.appendChild(group);

    this.tip = {
        group: group,
        text: text,
        talkBubble: talkBubble
    }
};

/**
 * component to draw the tip template. This method is only supposed to be used inside drawTipTemplate()
 * @param group
 * @returns {SVGELement}
 */
Data.prototype.drawTipTemplate_text = function (group){
    var text = draw.createText(0, -35, false, 12, "middle", false);
    var series = draw.createTextSpan(false, false, "null", 15, "start", false);
    text.ws_seriesName = series;
    text.appendChild(series);
    var valuesLabel = draw.createTextSpan(0, -20, "null", 12, "start", false);
    text.ws_valuesLabel = valuesLabel;
    var valuesData = draw.createTextSpan(false, false, "null", 12, "start", false);
    valuesData.setAttributeNS(null, "font-weight", "bold");
    text.ws_valuesData = valuesData;
    text.appendChild(valuesLabel);
    text.appendChild(valuesData);
    group.appendChild(text);
    return text;
};

/**
 * component to draw the tip template. This method is only supposed to be used inside drawTipTemplate()
 * @param group
 * @returns {SVGElement}
 */
Data.prototype.drawTipTempalte_talkBubble = function (group){
    //catw = change according to width
    var dArray = [0, -10, -5, -15, -5/*catw*/, -15, -5/*catw*/, -50, 5/*catw*/, -50, 5/*catw*/, -15, 5, -15, 5, -15];
    var d = "M" + dArray.join(" ") + "Z";
    var talkBubble  = draw.createPath(d);
    draw.setStrokeFill(talkBubble, "#0080C3", 2, "white");
    group.appendChild(talkBubble);
    //add the d values to the talkBubble.
    talkBubble.dArray = dArray;
    return talkBubble;
};