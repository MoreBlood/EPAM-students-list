var host = "http://localhost:8088";
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
        show_edit_center("filter");

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
        show_edit_center("edit", id, name);

    });
    $('#stud-body').on("click", ".small-button.delete",  function () {
        var id = $(this).parent().find(".gr-name").attr("gr-id");
        var name = $(this).parent().find(".gr-name").html();
        show_edit_center("delete", id, name);
    });
    $('#stud-body').on("click", "td.left-td.first",  function (e) {

        //console.log($(event.target).attr('class'));
        if ( $(event.target).attr('class').split(' ')[0] == "small-button")
            return;
        window.location.href = "group.html?group=" +$(this).parent().find(".gr-name").attr("gr-id");

    });



});

function CloseModal() {
    $(".modal_back").removeClass("visible-modal");
    $(".app").css({
        filter: "blur(0px)"
    })
}

function DeleteGr() {
        $("#stud-body").empty();
        RenderGroups();
    CloseModal();
}
function EditGr() {
    $("#stud-body").empty();
    RenderGroups();
    CloseModal();
}
function UpdateGr() {
    $("#stud-body").empty();
    RenderGroups("?minGradDate=" + $("#date-start").val() + "&maxGradDate=" + $("#date-end").val());
    CloseModal();
}

function show_edit_center(type, id,name) {
    $(".app").css({
        filter: "blur(2px)"
    });

    $(".modal-body").empty();
    $(".modal-footer").empty();
    $(".modal-header").empty();

    if (type === "edit"){
        $(".modal-header").append('<p class="big-text">Edit Group ' + name + ' name</p>');
        $(".modal-body").append('<br><div class="input-name-holder">' +
            '<input type="text" id="new-group-name" class="input r-border" placeholder="Group name" value="' + name +'">' +
            '<div class="input name"><p class="name-p">Name</p></div>'+
            '</div><br>');
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
        $(".modal-header").append('<p class="big-text">Delete Group ' + name + '?</p>');
        $.ajax({
            type: "GET",
            url: host + "/students?groupId=" + id,
            dataType: "json",
            success: function (data) {
                if (data.length) {
                    $(".modal-body").append('<div class="input-name-holder">' +
                        '<p class="some-info">' +data.length + " students will be also deleted"+ '</p>'

                        );
                    $(".modal-footer").append('<button id="cancel" class="button small green">Cancel</button>' +
                        '<button id="delete-gr" class="button small red" onclick="DeleteGr()">Delete</button>');
                }
                else DeleteGr();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                alert('Нет такой группы с id: ' + param);
            }
        });

    }
    $(".modal_back").addClass("visible-modal");

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
        $("#stud-body").append('<tr class="tr-gr hover"> <td class="left-td first"><span class="gr-name" gr-id="' + data[group].groupId + '">' + data[group].name +'</span><span class="small-button edit"></span>'+'<span class="small-button delete"></span>' +
            '</td>' + '<td class="left-td first mid">' + data[group].graduationDate + '</td>' +
            '<td class="mid-td">' + (Math.round(GetAvgMark(data[group].groupId) * 100) / 100) + '</td> </tr>')
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

function PopUpCreator() {

}