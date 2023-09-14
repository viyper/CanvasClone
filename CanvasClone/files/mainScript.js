var classesWrapper = document.getElementById("classesWrapper");
var toDoWrapper = document.getElementById("toDoWrapper");
var hideParamsElements = document.getElementsByClassName("assignmentParamFilter");
var hideTypeElements = document.getElementsByClassName("assignmentTypeFilter");
var courseFilterDiv = document.getElementById("assignmentCourseFilterDiv");
var hideCourseElements = document.getElementsByClassName("assignmentCourseFilter");
let clickDivs;
let classesDict = new Array();
let ids = new Array();
let links = new Array();
let badID = new Array();
let names = new Array();
let months = new Array("January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December");
let selectFilterVals = new Array();

function fillRequestHeader(req) {
    req.setRequestHeader("domain", getCookie("domain"));
    req.setRequestHeader("token", getCookie("token"));
}

window.onload = () => {   
    //Assignment Type Filter
    makeFilter(hideTypeElements, "Type");
    //Assignment Name Filter Will go here

    //Assignment Params Filter
    makeFilter(hideParamsElements, "Param");
    //Get Course Names and add to page 
    let x = new XMLHttpRequest();
    x.open("GET", 'coursesByUser/self');

    fillRequestHeader(x);

    x.onload = () => {
        let classes = JSON.parse(x.response).filter((x) => {
            return x.access_restricted_by_date != true;
        });
        names = classes.map((classObj) => classObj.name);
        ids = classes.map((classObj) => classObj.id);
        links = classes.map((classObj) => classObj.html_url);
        for (let i = 0; i < names.length; i++) {
            let p = names[i].split(' - ');
            classesDict[i] = `name=${p[0]};id=${ids[i]}`

            let className = document.createElement("div");
            className.className = "className";
            className.id = `className_${ids[i]}`;
            className.innerHTML = `${p[0]}`;
            className.href = links[i];
            let classOther = document.createElement("div");
            classOther.id = `classOther_${ids[i]}`;
            let classInput = document.createElement("div");
            let classtxtBox = document.createElement("input");
            classtxtBox.className = "custom_URL";
            classtxtBox.id = `boxLink_${ids[i]}`;
            classtxtBox.placeholder = "Input Custom URL Here";
            classInput.appendChild(classtxtBox);
            let classButton = document.createElement("button");
            classButton.id = `classUpdate_${ids[i]}`;
            classButton.innerHTML = "Set";
            classButton.addEventListener("click", function () {
                let v = this.attributes.id.value;
                v = v.split("_")[1];
                console.log(v);
                v = "boxLink_" + v;
                this.parentElement.parentElement.attributes.href.value = document.getElementById(v.value);
            });
            classInput.appendChild(classButton);
            classOther.appendChild(classInput);
            let classTeacher = document.createElement("div");
            classTeacher.className = "classTeacher";
            classTeacher.id = `classTeacher_${ids[i]}`;

            classesWrapper.appendChild(className);
            classesWrapper.appendChild(classOther);
            classesWrapper.appendChild(classTeacher);
        }
        //Get course Teachers and add to page
        for (let i = 0; i < ids.length; i++) {
            let z = new XMLHttpRequest();
            z.open("GET", `getCourseTeachers/${ids[i]}`);
            fillRequestHeader(z);
            z.onload = () => {
                if (z.response == "error") {
                    badID += ids[i];
                    for (let f = 0; f < classesDict.length; f++) {
                        if (classesDict[f].split(";")[1].split("=")[1] == ids[i]) {
                            classesDict.splice(f, 1);
                            f--;
                        }
                    }
                    document.getElementById(`className_${ids[i]}`).remove();
                    document.getElementById(`classTeacher_${ids[i]}`).remove();
                    document.getElementById(`classOther_${ids[i]}`).remove();
                    let filterRemove = document.getElementsByClassName(`filter_${ids[i]}`)
                    for (let k = 0; k < filterRemove.length; k++) {
                        findLabel(filterRemove[k]).remove();
                        filterRemove[k].nextSibling.remove();
                        filterRemove[k].remove();
                    }
                } else {
                    let teachers = JSON.parse(z.response);
                    if (teachers.length > 3) {
                        document.getElementById(`classTeacher_${ids[i]}`).innerHTML += `This class has ${teachers.length} teachers`;
                    } else {
                        for (let l = 0; l < teachers.length; l++) {
                            document.getElementById(`classTeacher_${ids[i]}`).innerHTML += teachers[l]["name"] + "<br>";
                        }
                    }
                }
            }
            z.send();

            //Get assignments and add them to page
            let c = new XMLHttpRequest();
            c.open("GET", `getCourseAssignments/${ids[i]}`);
            fillRequestHeader(c);
            c.onload = () => {
                if (c.response == "error") {
                    console.log("error");
                } else {
                    let assignments = JSON.parse(c.response);
                    for (let p = 0; p < assignments.length; p++) {
                        let d = assignments[i].due_at.split('-');
                        let month = parseInt(d[1]);
                        let day = d[2].slice(0, 2);
                        let year = d[0];
                        let mString = months[month];
                        if (badID.includes(i)) {
                            console.log("bad");
                        } else {
                            var typeDiv = document.createElement('div');
                            typeDiv.id = `assignment_${assignments[p].id}_Type`;
                            typeDiv.className = `assignmentType assignment${assignments[p].course_id}`;
                            typeDiv.style = "cursor: pointer;";

                            var nameDiv = document.createElement('div');
                            nameDiv.id = `assignment_${assignments[p].id}_Name`;
                            nameDiv.className = `assignmentName assignment${assignments[p].course_id}`;
                            nameDiv.innerHTML = `${assignments[p].name}`;
                            nameDiv.style = "cursor: pointer;";

                            var classDiv = document.createElement('div');
                            classDiv.id = `assignment_${assignments[p].id}_Class`;
                            classDiv.className = `assignmentClass assignment${assignments[p].course_id}`;
                            classDiv.innerHTML = `${names[i]}`;
                            classDiv.style = "cursor: pointer;";

                            var dueDiv = document.createElement('div');
                            dueDiv.id = `assignment_${assignments[p].id}_Due`;
                            dueDiv.className = `assignmentDue assignment${assignments[p].course_id}`;
                            dueDiv.innerHTML = `${mString}, ${day} ${year}`;
                            dueDiv.style = "cursor: pointer;";
                            if (assignments[p].submission_types[0] != "none") {
                                if (assignments[p].submission.workflow_state == "submitted") {
                                    typeDiv.className += " assignmentSubmitted";
                                    nameDiv.className += " assignmentSubmitted";
                                    classDiv.className += " assignmentSubmitted";
                                    dueDiv.className += " assignmentSubmitted";
                                } else if (assignments[p].submission.workflow_state == "unsubmitted" && assignments[p].submission_types[0] != "on_paper") {
                                    typeDiv.className += " assignmentUnsubmitted";
                                    nameDiv.className += " assignmentUnsubmitted";
                                    classDiv.className += " assignmentUnsubmitted";
                                    dueDiv.className += " assignmentUnsubmitted";
                                } else if (assignments[p].submission.workflow_state == "graded") {
                                    typeDiv.className += " assignmentGraded";
                                    nameDiv.className += " assignmentGraded";
                                    classDiv.className += " assignmentGraded";
                                    dueDiv.className += " assignmentGraded";
                                } else {
                                    console.log("Other Assignment Workflow Type: " + assignments[p].submission.workflow_state);
                                }

                                if (assignments[p].submission_types[0] == "on_paper" && assignments[p].submission_types.length == 1) {
                                    typeDiv.className += " assignmentPaper";
                                    nameDiv.className += " assignmentPaper";
                                    classDiv.className += " assignmentPaper";
                                    dueDiv.className += " assignmentPaper";
                                }
                                if (assignments[p].locked_for_user) {
                                    typeDiv.className += " assignmentLocked";
                                    nameDiv.className += " assignmentLocked";
                                    classDiv.className += " assignmentLocked";
                                    dueDiv.className += " assignmentLocked";
                                }
                            } else {
                                typeDiv.className += " assignmentNoSubmission";
                                nameDiv.className += " assignmentNoSubmission";
                                classDiv.className += " assignmentNoSubmission";
                                dueDiv.className += " assignmentNoSubmission";
                            }
                            typeDiv.setAttribute("href", assignments[p].html_url);
                            nameDiv.setAttribute("href", assignments[p].html_url);
                            classDiv.setAttribute("href", assignments[p].html_url);
                            dueDiv.setAttribute("href", assignments[p].html_url);
                            toDoWrapper.appendChild(typeDiv);
                            toDoWrapper.appendChild(nameDiv);
                            toDoWrapper.appendChild(classDiv);
                            toDoWrapper.appendChild(dueDiv);
                            typeDiv.addEventListener("click", function () {
                                console.log(typeDiv);
                                window.open(this.attributes.href.value, '_blank');
                            });
                            nameDiv.addEventListener("click", function () {
                                window.open(this.attributes.href.value, '_blank');
                            });
                            classDiv.addEventListener("click", function () {
                                window.open(this.attributes.href.value, '_blank');
                            });
                            dueDiv.addEventListener("click", function () {
                                window.open(this.attributes.href.value, '_blank');
                            });
                        }
                    }
                }

            }
            c.send();
        }
        for (let o = 0; o < classesDict.length; o++) {
            if (!badID.includes(classesDict[o].split(";")[1].split("=")[1])) {
                var courseOption = document.createElement("input");
                courseOption.type = "checkbox";
                courseOption.id = classesDict[o].split(";")[1].split("=")[1];
                courseOption.value = "assignment " + classesDict[o].split(";")[1].split("=")[1];
                courseOption.className = `assignmentCourseFilter filter_${classesDict[o].split(";")[1].split("=")[1]}`;
                var courseOptionLabel = document.createElement("label");
                courseOptionLabel.htmlFor = courseOption.id;
                courseOptionLabel.innerHTML = classesDict[o].split(";")[0].split("=")[1];
                courseOptionLabel.className = `filter_${classesDict[o].split(";")[1].split("=")[1]}`;
                courseFilterDiv.appendChild(courseOption);
                courseFilterDiv.appendChild(courseOptionLabel);
                courseFilterDiv.innerHTML += "<br/>";
            }
        }
        hideCourseElements = document.getElementsByClassName("assignmentCourseFilter");
        makeFilter(hideCourseElements, "Course");
    }
    x.send();
};


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function findLabel(el) {
    var idVal = el.id;
    let labels = document.getElementsByTagName('label');
    for (var i = 0; i < labels.length; i++) {
        if (labels[i].htmlFor == idVal)
            return labels[i];
    }
}
/*function makeFilter(elementList, word) {
    console.log(elementList);
    console.log(word);
    selectFilterVals.push(word);
    for (let i = 0; i < elementList.length; i++) {
        elementList[i].addEventListener("click", function () {
            let val = elementList[i].value;
            let parseWord = val.split(" ")[1];
            let hidingClass = document.getElementsByClassName(`assignment${parseWord}`);
            if (elementList[i].checked != false) {
                if (val != `Hide No ${word}` && val != `Toggle ${word}`) {
                    for (let i = 0; i < hidingClass.length; i++) {
                        hidingClass[i].classList.add("hidden");
                    }
                    selectFilterVals[word].push(`assignment${parseWord}`);
                } else if (val == `Hide No ${word}`) {
                    for (let i = 0; i < selectFilterVals[word].length; i++) {
                        let remove = document.getElementsByClassName(selectFilterVals[word][i]);
                        for (let p = 0; p < remove.length; p++) {
                            remove[p].classList.remove("hidden");
                        }
                    }
                    selectFilterVals[word] = new Array();
                    for (let p = 0; p < elementList.length; p++) {
                        elementList[p].checked = false;
                    }
                } else {
                    let allHide = document.getElementsByClassName(`assignment${word}Filter`);
                    for (let i = 0; i < allHide.length; i++) {
                        let val = allHide[i].value;
                        if (val != `Hide No ${word}` && val != `Toggle ${word}`) {
                            let parseWord = val.split(" ")[1];
                            let hidingClass = document.getElementsByClassName(`assignment${parseWord}`);
                            if (allHide[i].checked == false) {
                                for (let i = 0; i < hidingClass.length; i++) {
                                    hidingClass[i].classList.add("hidden");
                                }
                                selectFilterVals[word].push(`assignment${parseWord}`);
                            } else {
                                let remove = document.getElementsByClassName(`assignment${parseWord}`);
                                for (let p = 0; p < remove.length; p++) {
                                    remove[p].classList.remove("hidden");
                                }
                                selectFilterVals[word].splice(selectFilterVals[word].indexOf(`assignment${parseWord}`), 1);
                            }
                            allHide[i].checked = !allHide[i].checked;

                        }
                        document.getElementById(`Toggle ${word}`).checked = !document.getElementById(`Toggle ${word}`).checked;
                    }
                }
            } else {
                let remove = document.getElementsByClassName(`assignment${parseWord}`);
                for (let p = 0; p < remove.length; p++) {
                    remove[p].classList.remove("hidden");
                }
                selectFilterVals[word].splice(selectFilterVals[word].indexOf(`assignment${parseWord}`), 1);
            }

        });
    }
}*/

function makeFilter(elementList, activeList) {
    for (let i = 0; i < elementList.length; i++) {
        elementList[i].addEventListener("click", bigFilter(elementList, activeList, elementList[i]));
    }
}
function bigFilter(elementList, activeList, self) {
    for (let i = 0; i < elementList.length; i++) {
        switch (elementList.value) {
            case "None":
                filterNone(elementList, activeList);
                break;
            case "Toggle":
                filterToggle(elementList, activeList);
                break;
            default:
                otherFilter(elementList, activeList, self);
        }
    }
}
function filterNone(elementList, activeList) {
    for (let i = 0; i < activeList.length; i++) {
        activeList[i].classList.remove("hidden");
    }
    elementList.filter((element) => {
        if (element.checked) {
            element.checked = false;
        }
    });
}
function filterToggle(elementList, activeList) {

}
function otherFilter(elementList, activeList, self) {
    if (self.checked) {
        activeList
    } else {

    }
}