const system = [];
let user = [];
let counter = 1;
const speed = 1000;
const title = $("#level-title");
const buttons = $('.btn');

const userMadeChoice = () => {
    title.text("Game Over");
    system.length = 0;
    user.length = 0;
    counter = 1;
};

const buttonPressed = async (btn) => {
    const btnId = btn.attr("id");
    await new Audio(`./sounds/${btnId}.mp3`).play();
    const color = btn.css("background-color");
    btn.css({ "backgroundColor": "rgb(167, 191, 213)" });
    await btn.animate({ "opacity": "0.5" }, speed, () => {
        btn.css({ "backgroundColor": color, "opacity": "0.8" });
    });
};

const userButtonPressed = async () => {
    $(".btn").off("click");

    return new Promise(resolve => {
        $(".btn").click((event) => {
            const clickedElement = $(event.target);
            buttonPressed(clickedElement);
            const index = $(".btn").index(clickedElement);
            user.push(index);

            for (let i = 0; i < user.length; i++) {
                if (user[i] !== system[i]) {
                    userMadeChoice();
                    resolve(false);
                    return;
                }
            }

            if (user.length === system.length) {
                if (JSON.stringify(user) === JSON.stringify(system)) {
                    user.length = 0;
                    setTimeout(() => {
                        system.push(Math.floor(Math.random() * 4));
                        title.text(`Step ${counter++}`);
                        playArrSound(system).then(() => {
                            userButtonPressed().then(resolve);
                        });
                    }, 1000);
                } else {
                    userMadeChoice();
                    resolve(false);
                }
            }
        });
    });
};

const playArrSound = async (arr = []) => {
    for (let i = 0; i < arr.length; i++) {
        await new Promise(resolve => {
            setTimeout(() => {
                buttonPressed($(buttons[arr[i]]));
                resolve();
            }, speed + 50);
        });
    }
};

const startGame = async () => {
    if (system.length > 0) return;

    title.text("Game Start");
    counter = 1;

    while (counter) {
        system.push(Math.floor(Math.random() * 4));

        title.text(`Step ${counter++}`);
        await playArrSound(system);

        if (!(await userButtonPressed())) {
            title.text("Game Over");
            const color = $("body").css("background-color");
            $("body").css({ "backgroundColor": "red" });
            await $("body").animate({ "opacity": "1" }, speed, () => {
                $("body").css({ "backgroundColor": color, "opacity": "1" });
                location.reload();
            });
        }
    }
};

$(document).on('keydown', startGame);
