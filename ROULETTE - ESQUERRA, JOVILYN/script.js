document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const moneyInput = document.getElementsByName('money')[0];
    const betInput = document.getElementsByName('bet')[0];
    const messageDiv = document.getElementById('message');
    let isSpinning = false;
    let slotElements = document.querySelectorAll('.slot');
   
    let slotResults = [];

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function startSpinning() {
        if (isSpinning) return;
        isSpinning = true;

        const bet = parseInt(betInput.value);
        const money = parseInt(moneyInput.value);

        if (isNaN(bet) || isNaN(money) || bet <= 0 || bet > money) {
            alert("Please enter a valid bet and ensure you have enough money.");
            isSpinning = false;
            return;
        }

        moneyInput.value = money - bet;
        messageDiv.textContent = ""; // Clear the message

        slotElements.forEach(slot => {
            const values = slot.querySelector('.values');
            values.style.animation = `slotspin calc(1s / var(--speed)) linear infinite`;
            values.style.animationPlayState = 'running';
        });
    }

    function stopSpinning() {
        if (!isSpinning) return;
        isSpinning = false;

        slotResults = [];

        slotElements.forEach((slot, index) => {
            setTimeout(() => {
                const values = slot.querySelector('.values');
                const randomIndex = slowDownSlot(values, index);
                slotResults[index] = randomIndex;

                if (index === slotElements.length - 1) {
                    setTimeout(() => {
                        console.log('Slot Results:', slotResults); // Added logging
                        checkWinner(slotResults);
                    }, 1100);
                }
            }, index * 1000);
        });
    }

    function slowDownSlot(valuesContainer, index) {
        const currentTransform = getComputedStyle(valuesContainer).transform;
        valuesContainer.style.animation = 'none';
        const matrix = new WebKitCSSMatrix(currentTransform);
        const currentY = matrix.m42 % 2500;
        valuesContainer.style.transform = `translateY(${currentY}px)`;

        const values = valuesContainer.querySelectorAll('.value');
        const randomIndex = getRandomInt(0, values.length - 1);
        const targetY = -randomIndex * 250;

        setTimeout(() => {
            valuesContainer.style.transition = 'transform 1s ease-out';
            valuesContainer.style.transform = `translateY(${targetY}px)`;
        }, 100);

        return randomIndex;
    }

    function checkWinner(results) {
        const [result1, result2, result3] = results;
        const money = parseInt(moneyInput.value);
        const bet = parseInt(betInput.value);

        console.log('Results:', result1, result2, result3); 

        if (result1 === result2 && result1 === result3) {
            const firstSlot = slotElements[0].querySelectorAll('.value img')[result1];
            const matchedImage = firstSlot.getAttribute('src');

            let multiplier;
            if (matchedImage.includes('flower.png')) {
                multiplier = 10;
            } 
            else if(matchedImage.includes('image.png')) {
                multiplier = 20;
            }
            else if(matchedImage.includes('star.png')) {
                multiplier = 30;
            }
            else if(matchedImage.includes('shell.png')) {
                multiplier = 50;
            }
            else  {
                multiplier = 40;
            }

            const newMoney = money + (bet * multiplier);
            moneyInput.value = newMoney;
            messageDiv.textContent = "YOU WIN !";
        } else {
            messageDiv.textContent = "YOU LOSE !";
        }
    }

    startButton.addEventListener('click', startSpinning);
    stopButton.addEventListener('click', stopSpinning);
});
