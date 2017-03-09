var host = "http://localhost:8088";

$(document).ready(function () {

    var groupId = getUrlParameter("group");

    //if (groupId == undefined) groupId = "all";

    RenderGroupInfo(groupId);
    RenderStudents(groupId);

    $('#filter').click(function () {
        show_edit();

    });
    $('.close-background').click(function () {
        $(".modal_back").removeClass("visible-modal");

    });

    $('#update').click(function () {
        $("#stud-body").empty();
        RenderStudents("?minGradDate=" + $("#date-start").val() + "&maxGradDate=" + $("#date-end").val());

    });
    $('#stud-body').on("mouseenter", ".left-td.first",  function () {
        $(this).find(".small-button").css({
            opacity : 0.4
        })

    });
    $('#stud-body').on("mouseleave", ".left-td.first",  function () {
        $(this).find(".small-button").css({
            opacity : 0
        })

    });
    $('#stud-body').on("click", ".small-button.edit",  function () {
        console.log($(this).parent().find(".gr-name").attr("gr-id"));

    });
    $('#stud-body').on("click", ".small-button.delete",  function () {
        console.log($(this).parent().find(".gr-name").attr("gr-id"));

    });
    $('#stud-body').on("click", "td.left-td.first",  function (e) {
        if (e.target !== this)
            return;
        window.location.href = "group.html?group=" +$(this).parent().find(".gr-name").attr("gr-id");

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

function RenderStudents(param) {
    if (param == undefined) param = "";
    $.ajax({
        type: "GET",
        url: host + "/students?groupId=" + param,
        dataType: "json",
        success: function (data) {
            DrawGroups(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            alert('Нет такой группы с id: ' + param);
        }
    });
}
function RenderGroupInfo(id) {
    $.ajax({
        type: "GET",
        url: host + "/groups/id" + id,
        dataType: "json",
        success: function (data) {
            DrawGroupInfo(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            alert('Нет такой группы с id: ' + id);
        }
    });
}
function DrawGroupInfo(data) {

    $("#current-group").html(data.name);
    $(".big-year.end").html((data.graduationDate).substr(0,4));
    $(".big-year.start").html((data.graduationDate).substr(0,4)-4);
    document.title =  data.name + " Group";
}

function DrawGroups(data) {
    avg = 0;
    for (var student in data) {
        $("#stud-body").append('<tr class="tr-gr hover"> <td class="left-td first"><span class="gr-name" st-id="' + data[student].studentId + '">' + data[student].name +'</span><span class="small-button edit"></span>'+'<span class="small-button delete"></span>' +
            '</td>' + '<td class="mid-td">' + data[student].gpa + '</td> </tr>');
        avg += data[student].gpa;
    }
    $("#num-stud").html(data.length);
    $("#avg-mark").html((avg/data.length).toFixed(2));
}


function GetAvgStudentMark(groupId) {
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