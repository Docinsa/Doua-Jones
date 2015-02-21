$(document).on("pageinit", "#missions", function() {
var socket=io.connect(adresse_serveur);

$(document).on("click","#btn_emprunt", function(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
		$.mobile.changePage("#emprunt");
		return false;
	});
	

$(document).on("pageinit", "#missionAchat", function() {
var socket=io.connect(adresse_serveur);
//Affichage de l'argent disponible
socket.on('resultGetArgentDisponibleJoueur', function(data) {
	argentDispOrdre=data.argent_disponible
	argentDispOrdreAAfficher="Argent disponible : "+argentDispOrdre+" ฿"
	$("#consult_argentDisp").text(argentDispOrdreAAfficher);	
});


	//Recuperer la valeur du cours de l'entreprise
	$(function() {
		
					
		var btGetCours = document.getElementById("btGetCours");

		var values;
	
		socket.on("resultGetCoursEntreprise", function(datas){
	
			values = [{ data: datas, label: "Cours", }];

			$.plot("#placeholder", values, {
				xaxis: {
					mode: "time",
					min: (new Date(currentYear,currentMonth,currentDay)).getTime(),
					max: (new Date(currentYear,currentMonth,currentDay+1)).getTime(),
			},
				lines: {fill:true},
				legend: {position:"nw", backgroundOpacity:0.3}		
				//	zoom: {interactive: true},
				//	pan: {interactive: true}
		});	
	});

    //Recuperer la date actuelle

        var currentMonth=(new Date()).getMonth() ;
		var currentDay=(new Date()).getDate();
		var currentYear=(new Date()).getFullYear();
				
		$("#today").click(function (event) {
			event.preventDefault();
			event.stopImmediatePropagation();
			$.plot("#placeholder", values, {
				xaxis: {
					mode: "time",
					min: (new Date(currentYear,currentMonth,currentDay)).getTime(),
					max: (new Date(currentYear,currentMonth,currentDay+1)).getTime(),
				},
				lines: {fill:true},
				legend: {position:"nw", backgroundOpacity:0.3},
			});
			return false;
		});

		
		$("#lastweek").click(function (event) {
			event.preventDefault();
			event.stopImmediatePropagation();
			$.plot("#placeholder", values, {
				xaxis: {
					mode: "time",
					minTickSize: [1, "day"],
					min: (new Date(currentYear,currentMonth,currentDay-7)).getTime(),
					max: (new Date(currentYear,currentMonth,currentDay+1)).getTime(),
					timeformat: "%e/%m",
				//	dayNames: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"]
				},
				lines: {fill:true},
				legend: {position:"nw", backgroundOpacity:0.3},
			});
			return false;
		});
		
		$("#lastmonth").click(function (event) {
			event.preventDefault();
			event.stopImmediatePropagation();
			$.plot("#placeholder", values, {
				xaxis: {
					mode: "time",
					min: (new Date(currentYear, currentMonth-1, currentDay)).getTime(),
					max: (new Date(currentYear, currentMonth, currentDay)).getTime(),
				timeformat: "%e/%m",
				},
				lines: {fill:true},
				legend: {position:"nw", backgroundOpacity:0.3},
			});
			return false;
		});

	});

	//Champs desactive lors du chargement de la page
              $( "#saisiedate" ).prop( "disabled", true );
              
              //Initialisation du datepicker lors du chargement de la page
              $('#saisiedate').datepicker("setDate", new Date());
        
              // Changement du label en fonction du click pour la date de validité, le clik sur Date rend abled la zone input, le datepicker peut apparaître sur click de l'utilisateur
  
              $("#validite input").on("click",function(event) { 
  
                  if(event.target.id == "radio-choice-2") {
                      $( "#saisiedate" ).prop( "disabled", false );
                      $( "#legendedate" ).text("Sélectionner la date");
                  } else {
                      $( "#legendedate" ).text('');
                      $( "#saisiedate" ).prop( "disabled", true );
                      if(event.target.id == "radio-choice-1") {
                          $('#saisiedate').datepicker("setDate", new Date());	
                      }
                      if(event.target.id == "radio-choice-3"){
                          $('#saisiedate').datepicker("setDate", dateProchBilanReel);
						  $('#saisiedate').datepicker("refresh");
                      }
                  }
              });
 //Gestion de l'affichage des champs en fonction du type d'ordre choisi 
			  
			  $("#selectordre").on("change",function() {

			//On remet le formulaire à zéro lorsque l'on change de type d'ordre, sauf le sens de l'ordre et le type d'ordre
				//Prix
					$("#Prix").val('');
				//Slider Nombre
					$('#Nombre').val(1).slider("refresh");
				//Date de validite
					$("#validite input").prop("checked",false).checkboxradio("refresh");
					$("#radio-choice-1").prop("checked",true).checkboxradio("refresh");
				//DatePicker
					$('#saisiedate').datepicker("setDate", new Date()).datepicker("refresh");
				//Type de déclenchement
					$("#typedeclenchement input").prop("checked",false).checkboxradio("refresh");
					$("#radio-choice-h-2a").prop("checked",true).checkboxradio("refresh");
				//Seuil qui réapparaît, Plage qui disparaît
					$("#vplage").hide();
					$("#vplagelabel").hide();
					$("#vseuil").show();	
					$("#vseuillabel").show();					
				//Valeur du seuil
					$('#vseuil').val('');
				//Initialiser la plage
					$('#range-10a').val(1).slider("refresh");
					$('#range-10b').val(100).slider("refresh");
				  
			    //Ordre à cours limité
				   if ($(this).val() === 'cours_limite') { 
					  $("#declenchement").hide();
					  $("#Prix").prop("disabled",false);
				  }
			    //ordre au marché
				  if ($(this).val() === 'au_marche') { 
					  $("#declenchement").hide();
					  $("#Prix").prop("disabled",true);
				  }
			    //Ordre à déclenchement
				  if ($(this).val() === 'seuil_declenchement') {
					  $("#declenchement").show();
					  $("#Prix").prop("disabled",true);

				  }
			    //Ordre à la meilleure limite
				  if ($(this).val() === 'meilleure_limite') { 
					  $("#declenchement").hide();
					  $("#Prix").prop("disabled",true);
				  }  
				});
			
			//Champs et valeurs selon le type de déclenchement
			$("#typedeclenchement input").on("click",function(event) { 								                //seuil
				if (event.target.id=="radio-choice-h-2a") {
				$("#vplage").hide();
				$("#vplagelabel").hide();
				$("#vseuil").show();	
				$("#vseuillabel").show();
				//On nettoie ce que le joueur a entré dans plage
				$('#range-10a').val(1).slider("refresh");
				$('#range-10b').val(100).slider("refresh");
				}
				//plage
				if (event.target.id=="radio-choice-h-2b") {
				$("#vseuil").hide();
				$("#vseuillabel").hide();
				$("#vplage").show();
				$("#vplagelabel").show();	
					//On nettoie ce que le joueur a entré dans seuil et le label saisir un seuil ! en cas d'oubli	
				$('#vseuil').val('');	
				//On initialise les valeurs du slider à plus ou moins 5,5%
				var coursMoins=Math.round(coursEntrep*0.80*100)/100;
				var coursPlus=Math.round(coursEntrep*1.2*100)/100;
				$('#range-10a').prop('min',coursMoins).slider("refresh");
				$('#range-10a').prop('max',coursPlus).slider("refresh");
				$('#range-10b').prop('min',coursMoins).slider("refresh");
				$('#range-10b').prop('max',coursPlus).slider("refresh");
				//coursEntrep	
				}					
			});
	
 // Pas de texte dans des input nombres
              $(document).on("keypress","#Prix, #Nombre,#vplage, #vseuil",function (e){
                  var ev= e||window.event;
                  var k=ev.keyCode || ev.which; 
                  if ((k>57 || k<46) && (k!=8)) {
                      ev.returnValue=false; 
                      if (ev.preventDefault) 
                          ev.preventDefault(); 
                  }
              });
 // Envoi et réinitialisation du formulaire
              
              $('#commentForm').submit(function(event) {
				  event.preventDefault();
				  event.stopImmediatePropagation();
				  	var peutAcheter=false;
					var radio_type_date = $("input:radio[name='radio-choice-type-date']");
					var index_type_date = radio_type_date.index(radio_type_date.filter(':checked'));
					
					//On récupère l'index actif du type de déclenchement
					var radio_type_declenchement = $("input:radio[name='radio-choice-type-declenchement']");
					var index_type_declenchement = radio_type_declenchement.index(radio_type_declenchement.filter(':checked'));
					//On s'assure que le joueur ait rempli le champ prix (seul champ qui peut-être vide) en cas de choix de choix de l'ordre à cours limité
					if ( !$('#Prix').val() && $('#selectordre').val()==='cours_limite' ){
					alert('Il faut saisir un prix !');
					}
					else if ( !$('#vseuil').val() && $('#selectordre').val()==='seuil_declenchement' && index_type_declenchement==0  ) {
					alert('Il faut saisir le seuil !');
					}	
					else {	
					 
						 //On récupère la valeur de la borne inférieure ou du seuil que l'on nommera minimum (et de même pour la borne sup lors d'une vente)
						var minimum = $('#range-10a').val();
						var maximum = $('#range-10b').val();
						if ($('#selectordre').val() == 'seuil_declenchement') {
							//si c'est un seuil
							if (index_type_declenchement == 0) {
								//si c'est un achat	
								if ($('#select-custom-17').val() == 'achat') {
									minimum = parseFloat($('#vseuil').val());
									maximum = parseFloat($('#range-10b').val());
								}
								//si c'est une vente
								else {
									minimum = parseFloat($('#range-10a').val());
									maximum = parseFloat($('#vseuil').val());
								}
							}
	
						}

// vérifier la possibilité d'achat en comparant dispo et prix des actions
var prix_action
						if (!$('#Prix').val()) {
							prix_action = 0;
						}
						else {
							prix_action = parseFloat($('#Prix').val());
						}
						
					
						//si vente, pas de tests
						if ($('#select-custom-17 option:selected').val()=="vente") {
					
							peutAcheter=true;

						} 
						//sinon, si achat, tests sur la nature de l'ordre et la capacite du joueur à acheter
						else {
							//si ordre à cours limité 
							if($('#selectordre option:selected').val()=="cours_limite")   {

								if(argentDispOrdre < $("#Prix").val() * $("#Nombre").val()) {
									alert("Vous n'avez pas l'argent disponible pour acheter");
								}
								else {
									peutAcheter=true;
								}
							}
							//ordre meilleure limite ou au marché
							else if ($('#selectordre option:selected').val()=="meilleure_limite" || $('#selectordre option:selected').val()=="au_marche") {
								
								if(argentDispOrdre < coursEntrep * $("#Nombre").val()) {
									
								}
								else {
									peutAcheter=true;
								}
								
							
							}
							// ordre à déclenchement
							else  {
								//Seuil	
								if ($("#typedeclenchement input:checked").val()=="Seuil") {

									if(argentDispOrdre < $("#Nombre").val() * $("#vseuil").val()) 		{
		
									alert("Vous n'avez pas l'argent disponible pour acheter");
		
									}
									else {
										peutAcheter=true;
									}
								}
								else {
									if(argentDispOrdre < $("#Nombre").val() * $("#range-10b").prop('max')) {
		
										alert("Vous n'avez pas l'argent disponible pour acheter");
		
									}
									else {
										peutAcheter=true;
									}								
								}
							}
							//
						}
						
						if (peutAcheter) {
														//On envoie les données de l'ordre
							var dateAEnvoyer=new Date($('#saisiedate').datepicker("getDate"))	;					
							socket.emit('setOrdre',{
								idJoueur:idJoueur,
								idEntreprise:$('#entreprise_active').data('id_entreprise'),
								//parseFloat($('#entreprise_active').data("id_entreprise")),
								sens:$('#select-custom-17').val(),
								typeOrdre:$('#selectordre').val(),
								prix:prix_action,
								quantite:parseFloat($('#Nombre').val()),
								borneInf:minimum,
								borneSup:maximum,
								dateValidite:dateAEnvoyer
								});
				
							//On remet le formulaire à zéro après validation
								//Sens de l'ordre
							var myselectun = $( "#select-custom-17" );
							myselectun[0].selectedIndex = 0;
							myselectun.selectmenu( "refresh" );
								//Type de l'ordre
							var myselectdeux = $( "#selectordre" );
							myselectdeux[0].selectedIndex = 0;
							myselectdeux.selectmenu( "refresh" );
								//Valeur du prix
							$("#Prix").val('');
								//Slider Nombre
							$('#Nombre').val(1).slider("refresh");
								//Date de validite
							$("#validite input").prop("checked",false).checkboxradio("refresh");
							$("#radio-choice-1").prop("checked",true).checkboxradio("refresh");
							  //DatePicker
							$('#saisiedate').datepicker("setDate", new Date()).datepicker("refresh");
							//Type de déclenchement
							$("#typedeclenchement input").prop("checked",false).checkboxradio("refresh");
							$("#radio-choice-h-2a").prop("checked",true).checkboxradio("refresh");
							//Valeur du seuil
							$('#vseuil').val('');
							//Initialiser la plage
							$('#range-10a').val(1).slider("refresh");
							$('#range-10b').val(100).slider("refresh");
							
							//Cacher la div déclenchement
							$('#declenchement').hide();
							
							//Prix able
							$("#Prix").prop("disabled",false);
							
							}
						
						
					}

				  //On envoie le résultat par défaut de la fonction submit, on est passé par socket.io
				  return false;
				});		
});

// Envoyer demande au serveur pour récupérer les données nécessaures
$(document).on("pageshow", "#Entreprise", function() {
	var socket = io.connect(adresse_serveur);			
	
	socket.emit("getArgentDisponibleJoueur",idJoueur);
	socket.emit("getCoursEntreprise", $('#entreprise_active').data('id_entreprise'));

});

});
});

//CHECK IN
$(document).on("pageinit", "#missionCheckin", function() {
var socket=io.connect(adresse_serveur);
		function checkin(entreprise) {
			var teleportation = false;
			//Si le joueur se trouve à la BMC et qu'il fait un checkin dans une société à laquelle il n'a pas accès, on met le booléen "teleportation" à vrai
			if (google.maps.geometry.poly.containsLocation(position_joueur,Entreprise[1].Objet)) {
				if (!(location_contained_or_edge (entreprise.Objet))) {
					teleportation = true;
				}
			}
			//On envoie les données du checkin
			socket.emit('setCheckin',{
			idEntreprise : entreprise.index,
			idJoueur : idJoueur,
			teleportation : teleportation
			});
			
			
		}
		socket.on('resultSetCheckin', function (result) {
			alert(result);
			socket.emit('getArgentDisponibleJoueur',idJoueur);
			});
			
		var ok_ordre = false
		function openinfo(entreprise) {
			//On charge l'image de l'entreprise sur la page de l'entreprise
			document.getElementById('image_entreprise').setAttribute('src',entreprise.srcImageentreprise);
			if (entreprise.index == 1) {
				document.getElementById('image_bmc').setAttribute('src',entreprise.srcImageentreprise);
			}
			//On écrit le nom de l'entreprise dans le header
			$('#nom_entreprise').html(entreprise.nom);
			//On écrit le nom de l'entreprise dans le champ nom où il faut passer l'ordre
			$('#entreprise_active').html(entreprise.nom);
			//On stocke l'id de l'entreprise sélectionnée
			$('#entreprise_active').data("id_entreprise", entreprise.index);
			//On modifie le texte du profil de l'entreprise
			$('#texte_fiche_entreprise').text(entreprise.texteProfil);
			
			
			//On regarde si le joueur se trouve à la BMC
			var isAtBMC = false;
			if (google.maps.geometry.poly.containsLocation(position_joueur,Entreprise[1].Objet)) {
				isAtBMC = true;
			}
			
			
			//On affecte la variable isAtBMC à la page BMC profil pour savoir si on peut intéragir avec la boutique
			
			$('#bmcprofil').data("isAtBMC", isAtBMC);
			
			//On vérifie que l'on puisse bien passer un ordre
				ok_ordre = true;		
			if (document.getElementById('checkin').disabled == true) {				
				ok_ordre = false;
			}
			
			//On ferme l'infowindow	
			infowindow.close(map);
			//On affiche la page entreprise ou la page BMC
			if (entreprise.index != 1 && isAtBMC && !(location_contained_or_edge (entreprise.Objet)) ) {
				//si le joueur se trouve à la bmc et qu'il sélectionne une autre entreprise, il ne peut pas passer d'ordre
				ok_ordre = false;
			}
			if (entreprise.index != 1) {
				$.mobile.changePage("#Entreprise");
			}
			else {
				$.mobile.changePage("#bmcprofil");
			}
		}
		 	
			//On grise(respectivement dégrise) l'onglet passer un ordre si on est pas sur la zone
			$(document).on("pagebeforeshow", "#Entreprise", function() {
				$( "#tabs_entreprise" ).tabs({ active: 1 });
				
				if (ok_ordre==false) {	
					$("#tabs_entreprise").tabs("option", "disabled", [2]);
				}
				else {
					$( "#tabs_entreprise" ).tabs( "enable", 2 );
				}
				
				//On affiche l'onglet profil par défaut
				
				
				$("#tabs_entreprise").tabs( "option", "active", 1 );
				
			});
			
			$('#geolocation_icon').click(function (e) {
				e.stopImmediatePropagation();
				e.preventDefault();
				if ((coordonnees_joueur.latitude !=0 ) && (coordonnees_joueur.longitude !=0) ) {
					map.panTo(position_joueur);
					map.setZoom(17);
				}
				return false;
			});

	
//fin initialize
}
});


 
