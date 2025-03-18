function detectDevice() {
    const width = window.innerWidth;

    if (width <= 768) {
        // Mobile
        return "mobile";
    } else if (width <= 1024) {
        // Tablet
        return "tablet";
    } else {
        // Desktop
        return "desktop";
    }
}

addEventListener("DOMContentLoaded", (event) => {
    let temp = true;
    switch (detectDevice()) {
        case "desktop":
            break;
        case "mobile":
            document.getElementById("icon").addEventListener("click", () => {
                console.log("sldfjvn")
                let sidebar = document.getElementById("sidebar")
                let titoloCronologia = document.getElementById("titoloCronologia")
                let lista = document.getElementById("historyList")
                let content = document.getElementById("content")
                let center = document.getElementById("center")

                let wS;
                if (temp) {

                    wS = 80;

                    sidebar.style.width = wS + "%"
                    lista.style.display = "block"
                    // Se l'elemento non è visibile, rendilo visibile con dissolvenza
                    titoloCronologia.classList.remove("hidden");
                    center.classList.remove("visible");
                    setTimeout(function () {
                        titoloCronologia.classList.add("visible"); // Dopo che display è stato applicato, avvia la dissolvenza
                        center.classList.add("hidden"); // Dopo la dissolvenza, imposta display: none
                    }, 10);
                    
                    content.style.width = (100 - wS) + "%"
                    
                } else {
                    
                    wS = 10;
                    
                    sidebar.style.width = wS + "%"
                    lista.style.display = "none"
                    // Se l'elemento è visibile, nascondilo con dissolvenza
                    titoloCronologia.classList.remove("visible");
                    center.classList.remove("hidden");
                    setTimeout(function () {
                        titoloCronologia.classList.add("hidden"); // Dopo la dissolvenza, imposta display: none
                        center.classList.add("visible"); // Dopo che display è stato applicato, avvia la dissolvenza
                    }, 500); // 500 ms corrisponde alla durata della dissolvenza
                    
                    content.style.width = (100 - wS) + "%"
                }
                
                temp = !temp;
            });
            break;
    }

    var isReading = false;
    var shuffledBestemmie = [];
    var currentIndex = 0;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getNextBestemmiaIndex() {
        if (currentIndex >= shuffledBestemmie.length) {
            shuffledBestemmie = shuffleArray([...bestemmie]);
            currentIndex = 0;
        }
        return currentIndex++;
    }

    var shuffledBestemmie = [];

    function getRandomFromShuffled() {
        // If shuffled array is empty, refill it
        if (shuffledBestemmie.length === 0) {
            shuffledBestemmie = shuffleArray([...bestemmie]);
        }

        // Randomly select an index from the shuffled array
        var randomIndex = Math.floor(Math.random() * shuffledBestemmie.length);
        var selected = shuffledBestemmie[randomIndex];

        // Remove the selected item from the shuffled array
        shuffledBestemmie.splice(randomIndex, 1);

        return bestemmie.indexOf(selected);
    }

    var bestemmie = [];

    // Fetch bestemmie from the server-side
    fetch("fetch_bestemmie.php")
        .then(response => response.text()) // Ottiene il testo dalla risposta
        .then(data => {
            bestemmie = data.split("\n").filter(line => !/^\s*$/.test(line));
        })
        .catch(error => console.error("Error fetching bestemmie data:", error));


    document.getElementById("btn").addEventListener("click", () => {
        let random = getRandomFromShuffled();
        let historyList = document.getElementById("historyList");

        if (!historyList) {
            console.error("Errore: L'elemento con ID 'historyList' non esiste.");
            return;
        }

        if (bestemmie && bestemmie.length > 0 && random >= 0 && random < bestemmie.length) {
            let text = bestemmie[random];

            // Aggiorna il testo generato
            document.getElementById("generated").textContent = text;

            // Crea un nuovo elemento di lista
            let boh = document.createElement("li");
            boh.textContent = text;

            // Alterna il colore di sfondo (giallo o bianco)
            if (historyList.children.length % 2 === 0) {
                boh.style.backgroundColor = "rgb(236, 229, 229)";
            } else {
                boh.style.backgroundColor = "rgb(247, 243, 243)"; // Puoi cambiare il colore di sfondo qui
            }

            // Inserisce il nuovo elemento all'inizio della lista
            historyList.insertBefore(boh, historyList.firstChild);
        } else {
            console.error("Errore: L'array bestemmie è vuoto o l'indice è fuori range.");
        }
    });
});