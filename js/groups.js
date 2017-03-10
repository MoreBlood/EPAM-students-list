$(document).ready(function () {
    RenderGroups();
    $('#filter').click(function () {
        show_edit_center("filter");
    });
    $('#add-btn').click(function () {
        show_edit_center("add");
    });
    $('.close-background, .close-modal').click(function () {
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
        var grad = $(this).parent().parent().find(".left-td.first.mid").html();
        show_edit_center("edit", id, name, grad);

    });
    $('#stud-body').on("click", ".small-button.delete",  function () {
        var id = $(this).parent().find(".gr-name").attr("gr-id");
        var name = $(this).parent().find(".gr-name").html();
        show_edit_center("delete", id, name);
    });
    $('#stud-body').on("click", "td.left-td.first",  function (e) {
        if ( $(event.target).attr('class').split(' ')[0] == "small-button")
            return;
        window.location.href = "group.html?group=" +$(this).parent().find(".gr-name").attr("gr-id");
    });
});
function show_edit_center(type, id,name,grad) {
    $(".app").css({
        filter: "blur(2px)"
    });
    $(".modal-body, .modal-footer, .modal-header ").empty();

    if (type === "edit"){
        $(".modal-header").append('<p class="big-text">Edit Group ' + name + ' name</p>');
        $(".modal-body").append('<br><div class="input-name-holder">' +
            '<input type="text" required id="new-group-name" class="input r-border" placeholder="Group name" value="' + name +'">' +
            '<div class="input name"><p class="name-p">Name</p></div></div>'+
            '<br><div class="input-name-holder">' +
            '<input type="text" id="new-group-grad" required class="input r-border" placeholder="2007-05-09" value="' + grad +'">' +
            '<div class="input name"><p class="name-p">Graduation</p></div>'+
            '</div><br>');
        $("#new-group-grad").datepicker({
            format: "yyyy-mm-dd"
        });
        $(".modal-footer").append('<button id="edit-gr" type="submit" class="button small gray" onclick="EditGr(' + id + ')">Save</button>');
    }
    if (type === "add"){
        $(".modal-header").append('<p class="big-text">Add new Group</p>');
        $(".modal-body").append('<br><div class="input-name-holder">' +
            '<input type="text" id="new-group-name" class="input r-border" placeholder="Group name" >' +
            '<div class="input name"><p class="name-p">Name</p></div></div>'+
            '<br><div class="input-name-holder">' +
            '<input type="text" id="new-group-grad" class="input r-border" placeholder="2007-05-09">' +
            '<div class="input name"><p class="name-p">Graduation</p></div>'+
            '</div><br>');
        $("#new-group-grad").datepicker({
            format: "yyyy-mm-dd"
        });
        $(".modal-footer").append('<button id="edit-gr" class="button small gray" onclick="AddGr()">Add</button>');
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
        $('#date-end').datepicker({
            format: "yyyy-mm-dd"
        });
        $('#date-start').datepicker({
            format: "yyyy-mm-dd"
        });
        $(".modal-footer").append('<button id="update-gr" class="button small gray" onclick="UpdateGr()">Filter</button>');
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
                    $(".modal-footer").append('<button id="cancel" class="button small green"onclick="CloseModal()">Cancel</button>' +
                        '<button id="delete-gr" class="button small red" onclick="DeleteGr('+ id + ')">Delete</button>');
                }
                else DeleteGr(id);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                DrawException(jqXHR);
            }
        });

    }
    $(".modal_back").addClass("visible-modal");

}
function DrawGroups(data) {
    for (var group in data) {
        $("#stud-body").append('<tr class="tr-gr hover"> <td class="left-td first"><span class="gr-name" gr-id="' + data[group].groupId + '">' + data[group].name +'</span><span class="small-button edit"></span>'+'<span class="small-button delete"></span>' +
            '</td>' + '<td class="left-td first mid">' + data[group].graduationDate + '</td>' +
            '<td class="mid-td">' + (Math.round(GetAvgMark(data[group].groupId) * 100) / 100) + '</td> </tr>')
    }
}