startbtn = $("#start");
pausebtn = $("#pause");
stopbutn = $("#stop");
resetbtn = $("#reset");
fuckoffbtn = undefined;

$(function () {
    //ONLOAD SET PARAMS TO DEFAULT;
    stopbutn.hide();
    pausebtn.hide();
    enableSliders();
    clearStats();
});

function printUI(text) {
    var maxSize = 8;
    var row = "<p><span>> </span>" + text + "</p>";
    $("#console-out").append(row);
    if ($("#console-out p").length > maxSize) {
        $("#console-out p").first().remove();
    }
}


function setFreeRam(num){
    freeMemStat = num;
    //Calculate GBs
    var maxMemSise = $('#ramsize').val();
    var ram = num;

    var label = kbToLabel(ram)+" / "+kbToLabel(maxMemSise);
    $("#freeMemStat").text(label);
}
function setPagePoolStat(num){
    pagedPoolStat = num;

    var swapSize = $('#swapsize').val()
    var frameSize = $('#framesize').val()
    var swapPageCount = swapSize/frameSize;

    var percent = (pagedPoolStat/swapPageCount)*100;
    var label = percent+"%";
    $("#pagePoolStat").text(label);
}
function setPageHitStat(num){
    pageHitStat = num;
    $("#pageHitStat").text(num);
}
function setPageFaultStat(num){
    pageFaultStat = num;
    $("#pageFaultStat").text(num);
}
function incPageFault(){
    pageFaultStat++;
    setPageFaultStat(pageFaultStat)
    return pageFaultStat;
}
function incPageHit(){
    pageHitStat++
    setPageHitStat(pageHitStat);
    return pageHitStat;
}

function clearStats(){
    freeMemStat = 0;
    pagedPoolStat = 0;
    pageHitStat = 0;
    pageFaultStat = 0;
    $("#pageFaultStat").text(pageFaultStat);
    $("#pageHitStat").text(pageHitStat);
    $("#pagePoolStat").text(pagedPoolStat);
    $("#freeMemStat").text(freeMemStat);

    setFreeRam($('#ramsize').val());
    setPagePoolStat(0);
}

$(window).resize(function () {
    canvas.setWidth($("#canvasrow").width());
});

$(".algo-link").click(function () {
    $("#algoinput").val($(this).attr("data-algo"));
    $(".algo-text").text($(this).html());
});
$(".reset-all").click(function () {
//Reset All UI;

});

startbtn.click(function () {

    var params = {
        "algoNumber": parseInt($("#algoinput").val()),
        "ramSize": parseInt($("#ramsize").val()),
        "frameSize": parseInt($("#framesize").val()),
        "frameCount": parseInt($("#framecount").val()),
        "virtMemSize": parseInt($("#virtmemsize").val()),
        "swapSize": parseInt($("#swapsize").val()),
        "speed": parseInt($("#speedinput").val())
    };
    if (params.virtMemSize < params.ramSize) {
        alert("Virtual memory must be same or bigger then RAM!!!@#$%^!");
        return;
    }
    console.log("StartingAlgo:", params);
    startAlgo(params);
    startbtn.hide();
    stopbutn.show();
    pausebtn.attr("data-started", 1);
    pausebtn.show();
    clearStats();
    disableGUI();
});

stopbutn.click(function () {
    stopAlgo();
    startbtn.show();
    pausebtn.hide();
    pausebtn.attr("data-started", 0);
    enableGUI();
});
pausebtn.click(function () {
    if ($(this).attr("data-started") == 1) {
        pauseAlgo();
        $(this).attr("data-started", 0);
        $(this).children().first().first().text("Unpause");
        console.log("PAUSED");
    } else {
        unpauseAlgo();
        $(this).attr("data-started", 1);
        $(this).children().first().first().text("Pause");
        console.log("UNPAUSED");
    }
});
resetbtn.click(function () {
    resetSimulation();
    resetGUI();
});

// Speed Slider
$("#ex1").slider();
$("#ex1").on("slide", function (slideEvt) {
    speed = slideEvt.value;
    if (speed < 1) {
        speed = 1 / Math.pow(2, Math.abs(speed - 1));
    }
    $("#ex1SliderVal").text(speed + "X");
    $("#speedinput").val(speed);
    $("#speed").val(speed);

    setStep(speed);
});

function resetGUI() {
    clearStats();
    pausebtn.hide();
    stopbutn.hide();
    startbtn.show();
    $("#ex6SliderVal").text("512 KB");
    $("#ex7SliderVal").text("32 KB");
    $("#ex8SliderVal").text("512 KB");
    $("#ex9SliderVal").text("512 KB");
    $("#framecount-label").text("16");


    $("#ramsize").val("512");
    $("#framesize").val("32");
    $("#virtmemsize").val("512");
    $("#swapsize").val("512");
    $("#framecount").val("16");


    ex6Slider.destroy();
    //ex6Slider = new Slider("#ex6");// $("#ex6").slider();
    ex7Slider.destroy();
    //ex7Slider = new Slider("#ex7");/
    ex8Slider.destroy();
    //ex8Slider = new Slider("#ex8");
    ex9Slider.destroy();
    //ex9Slider = new Slider("#ex9");
    enableSliders();

};
function enableGUI() {
    $(".ui-lockable").removeClass("disabled");
    $(".slider.ui-lockable").each(function (i, obj) {
        $(obj).parent().find(".slider").removeClass("slider-disabled");
    });
}
function disableGUI() {
    $(".ui-lockable").addClass("disabled");
    $(".slider.ui-lockable").each(function (i, obj) {
        $(obj).parent().find(".slider").addClass("slider-disabled");
    });
}

function enableSliders() {



// Ram size Slider
    ex6Slider = new Slider("#ex6");// $("#ex6").slider();
    ex6Slider.on("slide", function (slideEvt) {
        var ramsliderVal = slideEvt.value;
        var virtmemslider = $("#ex8");//.attr("data-slider-value");
        //virtmemsize
        console.log("ram > virt", ramsliderVal + " > " + virtmemslider.val());
        //if (ramsliderVal > virtmemslider.attr("data-slider-value")){
        //    virtmemslider.attr("data-slider-value", ramsliderVal);
        //    virtmemslider.attr("data-slider-min", ramsliderVal);
        //    $("#ex8").slider().destroy().slider();
        //} else {
        //    virtmemslider.attr("data-slider-min", ramsliderVal);
        //}

        var ram = Math.pow(2, slideEvt.value); //KB;
        $('#ramsize').val(ram);
        var label = kbToLabel(ram);
        $("#ex6SliderVal").text(label);

        console.log($('#ramsize').val() + " div " + $('#framesize').val());
        var framecount = $('#ramsize').val() / $('#framesize').val();
        console.log("framecount: ", framecount);
        $("#framecount").val(framecount);
        $(".framecount-label").text(framecount);

        console.log($("#framecount").val());
    });

//Frame size slider
//$("#ex7").slider();
    ex7Slider = new Slider("#ex7");
    ex7Slider.on("slide", function (slideEvt) {
        var ram = Math.pow(2, slideEvt.value); //KB;
        $('#framesize').val(ram);
        var label = kbToLabel(ram);
        $("#ex7SliderVal").text( label);

        console.log($('#ramsize').val() + " div " + $('#framesize').val());
        var framecount = $('#ramsize').val() / $('#framesize').val();
        console.log("framecount: ", framecount);
        $("#framecount").val(framecount);
        $(".framecount-label").text(framecount);

        console.log($("#framecount").val());
    });


//Virtualmem size slider
    ex8Slider = new Slider("#ex8");
    ex8Slider.on("slide", function (slideEvt) {
        var ram = Math.pow(2, slideEvt.value); //KB;
        $('#virtmemsize').val(ram);
        var label = kbToLabel(ram);
        $("#ex8SliderVal").text(label);

        $(".virtmemsize-label").text(label);
    });

//Swap size slider
    ex9Slider = new Slider("#ex9");
    ex9Slider.on("slide", function (slideEvt) {
        var ram = Math.pow(2, slideEvt.value); //KB;
        $('#swapsize').val(ram);
        var label = kbToLabel(ram);

        $("#ex9SliderVal").text(label);

        $(".swapsize-label").text(label);
    });
}


function kbToLabel(kbCount){
    var label = " KB";
    var kb = kbCount
    if (kb > 2048) {
        label = " MB";
        kb = kb / 1024;
    }
    ; // Now we MB
    if (kb > 2048) {
        label = " GB";
        kb = kb / 1024;
    }
    ; // Now we GB;
    kb = Math.round(kb*100)/100;

    label = kb + label;
    return label;
}