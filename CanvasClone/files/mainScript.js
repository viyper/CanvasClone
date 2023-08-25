let x = new XMLHttpRequest();
var classesWrapper = document.getElementById("classesWrapper");
let classesDict = new Array();
let ids = new Array();

function fillRequestHeader(req) {
    req.setRequestHeader("domain", getCookie("domain"));
    req.setRequestHeader("token", getCookie("token"));
}
window.onload = () => {
    x.open("GET", `coursesByUser/2831`);
    fillRequestHeader(x);

    x.onload = () => {
        let classes = JSON.parse(x.response).filter((x) => {
            return x.access_restricted_by_date != true;
        });
        let names = classes.map((classObj) => classObj.name);
        ids = classes.map((classObj) => classObj.id);
        //console.log(ids);
        for (let i = 0; i < names.length; i++) {
            let p = names[i].split(' - ');
            classesDict[i] = `name=${p[0]};id=${ids[i]}`
            //classNames.innerHTML += '<br>' + p[0];
            classesWrapper.innerHTML += `<div id="className_${ids[i]}">${p[0]}</div>
            <div id="classGrade_${ids[i]}"></div>
            <div id="classTeacher_${ids[i]}"></div>`
        }
        console.log(classesDict);

        for (let i = 0; i < ids.length; i++) {
            //console.log("request: " + i);
            let z = new XMLHttpRequest();
            //console.log(ids[i]);
            z.open("GET", `getCourseTeachers/${ids[i]}`);
            fillRequestHeader(z);
            z.onload = () => {
                
                if (z.response == "error") {
                    document.getElementById(`className_${ids[i]}`).remove();
                    document.getElementById(`classTeacher_${ids[i]}`).remove();
                    document.getElementById(`classGrade_${ids[i]}`).remove();
                    console.log("bad");

                } else {
                    let teachers = JSON.parse(z.response);
                    //console.log(teachers);
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
        }
    }
    x.send();
    /*x.onreadystatechange = function () {
        if (x.readyState === XMLHttpRequest.DONE && x.status === 200) {
            console.log("ready");
            console.log(ids.length);
            console.log(ids);
            for (let i = 0; i < ids.length; i++) {
                console.log("request: " + i);
                let z = new XMLHttpRequest();
                z.open("GET", `getCourseTeachers/${ids[i]}`);
                fillRequestHeader(z);
                z.onload = () => {
                    let teachers = JSON.parse(z.response);
                    console.log(teachers);
                }
                z.send();
            }
        }
    }*/
    /*z.open("GET", `getCourseTeachers/2831`);
    z.onload = () => {
        let teachers = JSON.parse(x.response).filter((x) => {
            return x.access_restricted_by_date != true;
        });
        console.log("Teachers: " + teachers);
    }
    z.send();*/
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