namespace Endabgabe_EIA2 {

        console.log("live");
    
        //load listener
        window.addEventListener("load", handleLoad);
        //Globale Variablen
        export let color = "#ff0000";
        export let crc2: CanvasRenderingContext2D;
        export let moveables: Particle[] = [];
        let imageData: ImageData;
    
        //Interface für Server Kommunikation -> Zuordnungsnamen für die Server - Client Kommunikation
        interface Item {
            Radiusmultiplier: string;
            Particleamount: string;
            Lifespannumber: string;
            Particlesize: string;
            Color: string;
        }
    
        //Interface für FormDataJSON 
        interface FormDataJSON {
            [key: string]: FormDataEntryValue | FormDataEntryValue[];
        }
    
        //Interface zum Empfangen der Server Inhalte
        interface Entrys {
            [category: string]: Item[];
        }
    
        var form = document.getElementById("myForm");
        function handleForm(_event) { _event.preventDefault(); }
        form.addEventListener('submit', handleForm);
    
    
        let inputName: HTMLInputElement = document.getElementById("name");
        // load function Erstellt den Canvas etc.
        export async function handleLoad(_event: Event): Promise<void> {
            let canvas: HTMLCanvasElement | null = document.querySelector("canvas");
            crc2 = <CanvasRenderingContext2D>canvas.getContext("2d");
    
            let button: HTMLButtonElement = <HTMLButtonElement>document.querySelector("button[id=but1]");
            document.querySelector("canvas").addEventListener("click", click);
            button.addEventListener("click", sendData);
    
            menu();
            drawBackground();
            imageData = crc2.getImageData(0, 0, 800, 600);
    
            //holt daten vom Server und gibt sie an den Funktionaufruf loadData weiter
            let response: Response = await fetch("https://webuser.hs-furtwangen.de/~lakhalam/Database/index.php/?command=find&collection=data");
            let entry: string = await response.text();
            let data: Entrys = JSON.parse(entry);
            loadData(data);
            window.setInterval(update, 20);
        }
    
        function update(): void {
    
            // fügt Bild des Hintergrunds ein
            crc2.putImageData(imageData, 0, 0);
            // bewegt und zeichnet die Partikel
            for (let i = moveables.length - 1; i >= 0; i--) {
                let particle = moveables[i];
                particle.move(1 / 50);
                particle.draw();
    
                // löscht unsichtbaren Partikel aus dem Array
                if (particle.alpha <= 0) {
                    moveables.splice(i, 1);
                }
            }
        }
    
        // Particle Amount
        function click(_event: MouseEvent): void {
            // Paramenter für Postion -> Mausposition, und Velocity Parameter
            for (let i = 0; i < particleAmount; i++) {
                moveables.push(new Particle(new Vector(_event.clientX - crc2.canvas.clientLeft, _event.clientY - crc2.canvas.offsetTop), new Vector(10, 10)));
    
            }
        }
    
    
        // sendet die Daten aller Form Elemente an den Server
        async function sendData(): Promise<void> {
    
            if (inputName.value.length == 0) { alert("empty") }
            else {
                //Soll Seite neu laden da es sonst zu Problemen mit der Server Kommunikation kommen kann, wenn gleich ein neuer Eintrag
                //gespeichert wird
                window.open("./index.html", "_self");
                let formData: FormData = new FormData(document.forms[0]);
                let json: FormDataJSON = {};
                //Umwandlung FormData in Json FormData
                for (let key of formData.keys())
                    if (!json[key]) {
                        let values: FormDataEntryValue[] = formData.getAll(key);
                        json[key] = values.length > 1 ? values : values[0];
                    }
    
                let query: URLSearchParams = new URLSearchParams();
                let newJSON: string = JSON.stringify(json);
                query.set("command", "insert");
                query.set("collection", "data");
                query.set("data", newJSON);
                await fetch("https://webuser.hs-furtwangen.de/~lakhalam/Database/index.php?" + query.toString());
                console.log(newJSON);
    
            }
        }
    
        function loadData(_data: Entrys): void {
            //Der Liste werden die einzelnen Einträge der Daten vom Server hinzugefügt
            let list: string[] = [];
            for (let num in _data.data) {
                list.push(num);
            }
            //jeweils für jeden Eintrag der Liste werden Variablen deklariert und werden an loadEntry weitergegeben
            for (let index of list) {
    
                let name: string = _data.data[index].Name;
                let radius: number = _data.data[index].Radiusmultiplier;
                let particles: number = _data.data[index].Particleamount;
                let lifespan: number = _data.data[index].Lifespannumber;
                let size: number = _data.data[index].Particlesize;
                let color: string = _data.data[index].Color;
                loadEntry(name, radius, particles, lifespan, size, color, index);
            }
        }
    
        // Lädt die gespeicherten Einträge unten auf der Seite in dem neue Div Elemente erzeugt werden
        function loadEntry(_name: string, _radius: number, _particles: number, _lifespan: number, _size: number, _color: string, _index: string): void {
            let conDiv: HTMLDivElement = document.createElement("div");
            let newDiv: HTMLDivElement = document.createElement("div");
            let parent: Element = document.querySelector("#savedRockets");
    
            let loadButton: HTMLButtonElement = document.createElement("button");
    
            newDiv.innerHTML = _name;
            newDiv.id = "entry";
            //Event Listener für jedes geklickte Element werden erzeugt und ruf deleteItem auf
            newDiv.addEventListener("click", function (): void {
                deleteItem(conDiv, _index);
            });
            loadButton.innerText = "load";
    
    
            loadButton.addEventListener("click", function (): void {
                setValues(_name, _radius, _particles, _lifespan, _size, _color, _index);
            });
    
            conDiv.id = "conDiv";
            conDiv.appendChild(newDiv);
            conDiv.appendChild(loadButton);
            parent.appendChild(conDiv);
        }
    
        //Löscht den Eintrag aus dem Server raus und löscht die zugehörige Div vom Screen
        async function deleteItem(_newDiv: HTMLDivElement, _index: string): Promise<void> {
            _newDiv.parentElement.removeChild(_newDiv);
            let query: URLSearchParams = new URLSearchParams();
            query.set("command", "delete");
            query.set("collection", "data");
            query.set("id", _index.toString());
            await fetch("https://webuser.hs-furtwangen.de/~lakhalam/Database/index.php?" + query.toString());
            console.log("deleted");
        }
    
    // Slider haben mit JSON.stringify nicht mehr die Position geändert
        function setValues(_name: string, _radius: number, _particles: number, _lifespan: number, _size: number, _color: string, _index: string) {
            console.log("set values for " + _name);
    
            //Größe der Explosion 
            radiusMultiplier = _radius;
            outputRadius.innerHTML = _radius; // Display the default slider value
            // Update the current slider value (each time you drag the slider handle)
            sliderRadius.value = _radius;
    
            // Anzahl der Partikel -> Main click Funktion
            outputParticle.innerHTML = _particles; // Display the default slider value
            particleAmount = _particles;
            // Update the current slider value (each time you drag the slider handle)
            sliderParticle.value = _particles;
    
    
            // Lebensdauer der Partikel 
            outputLifespan.innerHTML = _lifespan / 100; // Display the default slider value
            console.log()
            lifespanNumber = _lifespan / 100;
            sliderLifespan.value = _lifespan / 100;
    
            // Größe der Partikel 
            particleSizeValue.innerHTML = _size; // Display the default slider value
            particleSize = _size;
            particleSizeSlider.value = _size;
    
            // Farbwerte 
            let colorValue = <HTMLInputElement>document.getElementById("colorpicker");
            let colorValueName = document.getElementById("colorValue");
            colorValue.value = _color;
            color = colorValue.value;
    
    
        }
    
    
    
    
    
    }