var host = "http://localhost:8088";

$(document).ready(function () {

    var groupId = getUrlParameter("group");

    //if (groupId == undefined) groupId = "all";

    RenderGroupInfo(groupId);
    RenderStudents(groupId);

    $('#update').click(function () {
        $("#stud-body").empty();
        RenderStudents("?minGradDate=" + $("#date-start").val() + "&maxGradDate=" + $("#date-end").val());

    });
    $('.close-background').click(function () {

        CloseModal();
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
        var id = $(this).parent().find(".gr-name").attr("gr-id");
        var name = $(this).parent().find(".gr-name").html();
        var mark = $(this).parent().parent().find(".mid-td").html();
        var group = $("#current-group").html();

        show_edit_center("edit", id, name, mark, group);

    });
    $('#stud-body').on("click", ".small-button.delete",  function () {
        var id = $(this).parent().find(".gr-name").attr("st-id");
        var name = $(this).parent().find(".gr-name").html();
        show_edit_center("delete", id, name);
    });



});

function CloseModal() {
    $(".modal_back").removeClass("visible-modal");
    $(".app").css({
        filter: "blur(0px)"
    })
}
function show_edit_center(type, id,name,mark,group) {
    $(".app").css({
        filter: "blur(2px)"
    });

    $(".modal-body").empty();
    $(".modal-footer").empty();
    $(".modal-header").empty();

    if (type === "edit"){
        var groups =  JSON.parse(GetGroups());
        var selects = "";
        for (var gr in groups){
            selects += "<option>" + groups[gr].name + "</option>"
        }
        $(".modal-header").append('<p class="big-text">Edit Student ' + name + '</p>');
        $(".modal-body").append('<br><div class="input-name-holder">' +
            '<input type="text" id="new-group-name" class="input r-border" placeholder="Group name" value="' + name +'">' +

            '<div class="input name"><p class="name-p">Name</p></div></div><br>'+

            '<div class="input-name-holder">' +
            '<input type="text" name="" class="input r-border" placeholder="8.9" value="' + mark +'">' +
            '<div class="input name"><p class="name-p">Mark</p></div></div><br>'+

            '<select class="select-modal">' + selects+
            '</select>'+
            '</div><br><br>');
        $(".select-modal").val(group);
        $(".modal-footer").append('<button id="edit-gr" class="button small gray" onclick="EditGr()">Edit</button>');
    }
    if (type === "filter"){
        $(".modal-header").append('<p class="big-text">Filter by date</p>');
        $(".modal-body").append('<br><div class="input-name-holder">' +
            '<input type="text" id="date-start" class="input r-border" placeholder="1970-01-01">' +
            '<div class="input name"><p class="name-p">From</p></div>' +
            '</div><br>' +
            '<div class="input-name-holder">' +
            '<input type="text" id="date-end" class="input r-border" placeholder="2007-01-01">' +
            '<div class="input name"><p class="name-p">To</p></div>' +
            '</div><br>');
        $(".modal-footer").append('<button id="update-gr" class="button small gray" onclick="UpdateGr()">Edit</button>');
    }
    if (type === "delete"){
        $(".modal-header").append('<p class="big-text">Delete student ' + name + '?</p>');
        $(".modal-body").append('<p class="some-info">Information will be deleted</p>');
        $(".modal-footer").append('<button id="cancel" class="button small green" onclick="CloseModal()">Cancel</button>' +
            '<button id="delete-gr" class="button small red" onclick="DeleteGr()">Delete</button>');
    }


    $(".modal_back").addClass("visible-modal");

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


function GetGroups() {
    var resp = $.ajax({
        type: "GET",
        url: host + "/groups",
        dataType : "json",
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