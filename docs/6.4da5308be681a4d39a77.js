(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{Kb0Y:function(t,e,n){"use strict";n.r(e),n.d(e,"AdminModule",function(){return O});var b=n("ofXK"),c=n("tyNb"),r=n("XNiG"),i=n("fXoL"),o=n("njyG");function a(t,e){1&t&&(i.Pb(0,"tr"),i.Pb(1,"td"),i.uc(2,"1"),i.Ob(),i.Pb(3,"td"),i.uc(4,"Alex"),i.Ob(),i.Pb(5,"td"),i.uc(6,"Alexander"),i.Ob(),i.Pb(7,"td"),i.uc(8,"Teacher"),i.Ob(),i.Pb(9,"td"),i.Pb(10,"button",5),i.uc(11,"View"),i.Ob(),i.Pb(12,"button",6),i.uc(13,"Edit"),i.Ob(),i.Pb(14,"button",6),i.uc(15,"Delete"),i.Ob(),i.Ob(),i.Ob())}let u=(()=>{class t{constructor(){this.dtOptions={},this.dtTrigger=new r.a}ngOnInit(){this.dtOptions={pageLength:6,info:!1,lengthChange:!1}}ngOnDestroy(){this.dtTrigger.unsubscribe()}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=i.Eb({type:t,selectors:[["app-admin-users"]],decls:27,vars:9,consts:[[1,"text-center"],[1,"container","p-4"],["datatable","",1,"row-border","hover","stripe","compact","text-center",3,"dtOptions"],[3,"ngTemplateOutlet"],["row",""],["routerLink","1",1,"btn","btn-danger","mx-1"],[1,"btn","btn-danger","mx-1"]],template:function(t,e){if(1&t&&(i.Pb(0,"h1",0),i.uc(1,"Users"),i.Ob(),i.Pb(2,"div",1),i.Pb(3,"table",2),i.Pb(4,"thead"),i.Pb(5,"tr"),i.Pb(6,"th"),i.uc(7,"ID"),i.Ob(),i.Pb(8,"th"),i.uc(9,"First Name"),i.Ob(),i.Pb(10,"th"),i.uc(11,"Last Name"),i.Ob(),i.Pb(12,"th"),i.uc(13,"Role"),i.Ob(),i.Pb(14,"th"),i.uc(15,"Actions"),i.Ob(),i.Ob(),i.Ob(),i.Pb(16,"tbody"),i.Lb(17,"div",3),i.Lb(18,"div",3),i.Lb(19,"div",3),i.Lb(20,"div",3),i.Lb(21,"div",3),i.Lb(22,"div",3),i.Lb(23,"div",3),i.Lb(24,"div",3),i.Ob(),i.Ob(),i.Ob(),i.sc(25,a,16,0,"ng-template",null,4,i.tc)),2&t){const t=i.nc(26);i.yb(3),i.gc("dtOptions",e.dtOptions),i.yb(14),i.gc("ngTemplateOutlet",t),i.yb(1),i.gc("ngTemplateOutlet",t),i.yb(1),i.gc("ngTemplateOutlet",t),i.yb(1),i.gc("ngTemplateOutlet",t),i.yb(1),i.gc("ngTemplateOutlet",t),i.yb(1),i.gc("ngTemplateOutlet",t),i.yb(1),i.gc("ngTemplateOutlet",t),i.yb(1),i.gc("ngTemplateOutlet",t)}},directives:[o.a,b.o,c.b],styles:["",".btn[_ngcontent-%COMP%] {\n    width: 80px;\n  }"]}),t})();var s=n("yoEt"),l=n("lGQG");const d=[{path:"users",canActivate:[(()=>{class t{constructor(t,e,n){this.authService=t,this.router=e,this.location=n}canActivate(t,e){return this.authService.userRole===s.a.Admin||(this.router.navigateByUrl("/404",{skipLocationChange:!0}).then(t=>{t&&this.location.replaceState(e.url)}),!1)}}return t.\u0275fac=function(e){return new(e||t)(i.Wb(l.a),i.Wb(c.a),i.Wb(b.g))},t.\u0275prov=i.Gb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()],component:u}];let p=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=i.Ib({type:t}),t.\u0275inj=i.Hb({imports:[[c.e.forChild(d)],c.e]}),t})(),O=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=i.Ib({type:t}),t.\u0275inj=i.Hb({imports:[[b.b,p,o.b]]}),t})()}}]);