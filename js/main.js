var host = "http://192.168.0.102:8088";
$(document).ready(function () {
    if(kek=getUrlParameter('zalupa'))  alert(kek);

    RenderGroups();
    $('#date-end').datepicker({
        format: "yyyy-mm-dd"
    });
    $('#date-start').datepicker({
        format: "yyyy-mm-dd"
    });
    $('#filter').click(function () {
        show_edit();

    });
    $('.close-background').click(function () {
        $(".modal_back").removeClass("visible-modal");

    });
    $('#update').click(function () {
        $("#stud-body").empty();
        RenderGroups("?minGradDate=" + $("#date-start").val() + "&maxGradDate=" + $("#date-end").val());

    });


});

function show_edit() {
    $(".modal_back").addClass("visible-modal");
    $("#filter-edit").css({
        top: event.pageY,
        left: event.pageX,
        display: 'flex'
    });
    if (event.pageY + $("#filter-edit").height() > $(window).height()) $("#filter-edit").css({
        top: $(window).height() - $("#filter-edit").height() * 1.5
    });
    if (event.pageX + $("#filter-edit").width() > $(window).width()) $("#filter-edit").css({
        left: $(window).width() - $("#filter-edit").width() * 1.5
    });
}

function RenderGroups(param) {
    if (param == undefined) param = "";
    $.ajax({
        type: "GET",
        url: host + "/groups" + param,
        dataType: "json",
        success: function (data) {
            DrawGroups(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
        }
    });
}
function DrawGroups(data) {
    for (var group in data) {
        $("#stud-body").append('<tr class="tr-gr"> <td class="left-td first">' + data[group].name + '</td>' + '<td class="left-td first mid">' + data[group].graduationDate + '</td>' + '<td class="mid-td">' + (Math.round(GetAvgMark(data[group].groupId) * 100) / 100) + '</td> </tr>')

    }

}
function GetAvgMark(groupId) {
    var resp = $.ajax({
        type: "GET",
        url: host + "/students/gpa?groupId=" + groupId,
        async: false,
        success: function (data) {
            //alert(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            alert('findAll: ' + textStatus);
        }
    });
    return resp.responseText;

}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};