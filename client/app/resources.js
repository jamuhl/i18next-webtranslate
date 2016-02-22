define([
    // Libs
    "jquery",
    "underscore"
],

function($, _) {

    return {
        en: {
            translation: {
                layout: {
                    header: {
                        language: 'english'
                    }
                },
                editor: {
                    choose: 'select',
                    addKey: 'add Key',
                    add: 'add',
                    'delete': 'delete',
                    edit: 'edit',
                    cancel: 'cancel',
                    save: 'save',
                    test: 'test',
                    filterKeys: 'filter keys',
                    filterValue: 'filter value',
                    compare: 'compare to',
                    download: 'download',
                    th: {
                      key: 'key',
                      specificValue: 'specific value',
                      displayedValue: 'displayed value',
                      compareValue: 'compare value'
                    },
                    resourceItem: {
                        compare: 'compare',
                        options: 'options',
                        optionsDesc: 'one option per line, eg. count=0'
                    }
                }
            }
        },

        de: {
            translation: {
                layout: {
                    header: {
                        language: 'deutsch'
                    }
                },
                editor: {
                    choose: 'Wählen',
                    addKey: 'Schlüssel hinzufügen',
                    add: 'hinzufügen',
                    'delete': 'löschen',
                    edit: 'ändern',
                    cancel: 'abbrechen',
                    save: 'speichern',
                    test: 'testen',
                    filterKeys: 'Schlüssel filtern',
                    filterValue: 'Inhalt filtern',
                    compare: 'Vergleichen mit',
                    download: 'herunterladen',
                    th: {
                        key: 'Schlüssel',
                        specificValue: 'spezifischer Wert',
                        displayedValue: 'angezeigter Wert',
                        compareValue: 'Vergleich'
                    },
                    resourceItem: {
                        compare: 'vergleichen',
                        options: 'Optionen',
                        optionsDesc: 'Eine Option pro Zeile, bspw. count=0'
                    }
                }
            }
        },

        it: {
            translation: {
                layout: {
                    header: {
                        language: 'italiano'
                    }
                },
                editor: {
                    choose: 'selezionare',
                    addKey: 'aggiungere chiave',
                    add: 'aggiungere',
                    'delete': 'cancellare',
                    edit: 'modificare',
                    cancel: 'cancellare',
                    save: 'memorizzare',
                    test: 'provare',
                    filterKeys: 'filtrare chiave',
                    filterValue: 'filtrare valore',
                    compare: 'cparagonare a',
                    download: 'scaricare',
                    th: {
                        key: 'chiave',
                        specificValue: 'valore specificato',
                        displayedValue: 'valore indicato',
                        compareValue: 'cparagonare valore'
                    },
                    resourceItem: {
                        compare: 'paragonare',
                        options: 'opzione',
                        optionsDesc: 'un opzione per riga'
                    }
                }
            }
        },

        fr: {
            translation: {
                layout: {
                    header: {
                        language: 'français'
                    }
                },
                editor: {
                    choose: 'Langue cible',
                    addKey: 'Ajouter une clé',
                    add: 'Ajouter',
                    'delete': 'Supprimer',
                    edit: 'Modifier',
                    cancel: 'Annuler',
                    save: 'Mémoriser',
                    test: 'Tester',
                    filterKeys: 'Filtrer par clé',
                    filterValue: 'Filtrer par valeur',
                    compare: 'Langue source',
                    download: 'Télécharger',
                    th: {
                        key: 'Clé',
                        specificValue: 'Valeur dans la langue cible',
                        displayedValue: 'Valeur dans la langue source',
                        compareValue: 'Comparer'
                    },
                    resourceItem: {
                        compare: 'Comparer',
                        options: 'Option',
                        optionsDesc: 'Une option par ligne'
                    }
                }
            }
        },
        
        nl: {
            translation: {
                layout: {
                    header: {
                        language: 'nederlands'
                    }
                },
                editor: {
                    choose: 'selecteer',
                    addKey: 'voeg sleutel toe',
                    add: 'invoegen',
                    'delete': 'verwijder',
                    edit: 'bewerk',
                    cancel: 'annuleren',
                    save: 'opslaan',
                    test: 'test',
                    filterKeys: 'filter sleutels',
                    filterValue: 'filter waarde',
                    compare: 'vergelijk met',
                    download: 'download',
                    th: {
                        key: 'sleutel',
                        specificValue: 'specifieke waarde',
                        displayedValue: 'weergegeven waarde',
                        compareValue: 'vergelijk waarde'
                    },
                    resourceItem: {
                        compare: 'vergelijk',
                        options: 'opties',
                        optionsDesc: 'een optie per regel, bijv. count=0'
                    }
                }
            }
        }

    };
});
