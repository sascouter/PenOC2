﻿var LogResults = LogResults || {};

//--------------------------------------------------------
LogResults.showLog = function (intLog) {
    var strResults = "";
    var blnFirst = false;
    var objLog;
    var blnDisplayPoints = true;
    var blnDisplayEventCount = true;
    var blnRotateHeadings = false;

    objLog = LogsService.LogDetails(intLog);
    objLog.events = LogsService.LogEvents(intLog);
    Global.addLogResults(objLog);

    if (Global.isPhone) {
        blnDisplayEventCount = false;
        blnRotateHeadings = true;
        if(objLog.events.length > 3){
                blnDisplayPoints = false;
        }
    };

    if (Global.isTablet) {
        switch (true) {
            case (objLog.events.length < 6):
                break;
            case (objLog.events.length >= 10):
                blnDisplayEventCount = false;
            default:
                blnRotateHeadings = true;
                break;
        }
    };

    strResults += "<div class='tab-content' style='padding-left: 30px; padding-right: 30px;'>";
    strResults += "<div class='pill'><div class='left'><span class='eventCount'>" + objLog.eventCount + "</span></div><div> events included</div></div>";
    if (objLog.disregardWorst > 0) {
        strResults += "<div class='pill'><div class='left'><span class='eventCount'>" + (objLog.eventCount - objLog.disregardWorst) + "</span></div><div><span> best results counted</span></div></div>";
    }
    strResults += "</div>";
    strResults += "<table class='logTable'>";
    strResults += "<colgroup></colgroup>";
    if (blnDisplayEventCount) { strResults += "<colgroup></colgroup>" };
    strResults += "<colgroup></colgroup>";
    strResults += "<colgroup class='points'></colgroup>";
    objLog.events.forEach(function () {
        strResults += "<colgroup class='event'></colgroup>";
    });
    strResults += "<thead>";
    strResults += "<tr>";
    strResults += "<th></th>";
    strResults += "<th></th>";
    if (blnDisplayEventCount) { strResults += "<th></th>" };
    strResults += "<th></th>";
    if (blnDisplayPoints) {
        objLog.events.forEach(function (event) {
            strResults += "<th class='eventName number";
            if (blnRotateHeadings) { strResults += " rotate" };
            strResults += "' title = '" + event.eventName;
            strResults += "'><div>" + event.venueName + "</div></th>";
        });
    }
    strResults += "</tr>";

    strResults += "<tr>";
    strResults += "<th class='number'>Pos.</th>";
    strResults += "<th>Competitor</th>";
    if (blnDisplayEventCount) { strResults += "<th class='number'>Events</th>" };
    strResults += "<th class='number points'>Points</th>";
    if (blnDisplayPoints) {
        objLog.events.forEach(function (event) {
            strResults += "<th class='number";
            if (blnRotateHeadings) { strResults += " rotate" };
            strResults += "' style='white-space: nowrap'><div>" + Global.parseDate(event.eventDate).displayDate() + "</div></th>";
        });
    }
    strResults += "</tr>";

    strResults += "</thead>";

    objLog.results.forEach(function (result) {
        strResults += "<tr>";
        strResults += "<td class='number'>" + result.position + ".</td>";
        strResults += "<td class='competitor' idCompetitor='" + result.competitorID + "'><span class='clickable'>" + result.competitorName + "</span></td>";
        if (blnDisplayEventCount) { strResults += "<td class='number'>" + result.results.length + "</td>" };
        strResults += "<td class='number points'>" + result.totalPoints + "</td>";
        if (blnDisplayPoints) {
            objLog.events.forEach(function (event) {
                strResults += "<td";
                strClass = "number result";
                strTitle = "";
                blnFound = false;
                blnDeduct = false;
                blnOrganiser = false;
                for (i = 0; i < result.results.length; i++) {
                    if (result.results[i].eventID == event.eventID) {
                        if (result.results[i].deduct === true) { blnDeduct = true };
                        if (result.results[i].organiser === true) { blnOrganiser = true };
                        intPoints = result.results[i].points;
                        blnFound = true;
                        break;
                    }
                }

                if (blnFound) {
                    if (blnOrganiser) {
                        strClass += " organiser";
                        strTitle = "Organiser";
                    };
                    if (blnDeduct) {
                        strClass += " deduct"
                        strTitle = "Not Counted";
                    }
                }

                strResults += " class='" + strClass + "'";
                strResults += " title='" + strTitle + "'";
                strResults += ">";

                if (blnFound) {
                    strResults += intPoints;
                }

                strResults += "</td>";
            });
        }
        strResults += "</tr>";
    });
    strResults += "</table>"

    Modal.setTitle(objLog.name + " (" + objLog.year + ")");
    Modal.setBody(strResults);

    LogResults.tableMouseOverHandler();
    LogResults.competitorClickHandler();

    Modal.show("log", { "intLog": intLog }, objLog.name + " (" + objLog.year + ")");

    ga('send', 'pageview', {
        page: '/LogResults',
        title: 'Log Results'
    });

}

//--------------------------------------------------------
LogResults.tableMouseOverHandler = function () {
    $(".logTable").delegate('td.result', 'mouseover', function () {
        $(this).addClass("highlight");
        $(this).parent().addClass('highlight');
        $("colgroup").eq($(this).index()).addClass("highlight");
    });
    $(".logTable").delegate('td.result', 'mouseleave', function () {
        $(this).removeClass("highlight");
        $(this).parent().removeClass('highlight');
        $("colgroup").eq($(this).index()).removeClass("highlight");
    });
}

//--------------------------------------------------------
LogResults.competitorClickHandler = function () {
    $(".logTable").on("click", "td.competitor span.clickable", function (event) {
        var objTarget;
        objTarget = $(this).closest("td.competitor");
        intCompetitor = objTarget.attr("idCompetitor");
        CompetitorResults.showCompetitor(intCompetitor);
    });
};
