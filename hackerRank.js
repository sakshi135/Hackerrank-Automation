const puppeteer = require("puppeteer");
const { answer } = require("./codes.js");
let { email, password } = require("./credentials");
let browserOPenPromise = puppeteer.launch({
  headless: false,
  defaultViewport: null,
  args: ["--start-maximized"],
});
browserOPenPromise
  .then(function (browser) {
    console.log("browser is open");
    let allTabsPromise = browser.pages();
    return allTabsPromise;
  })
  .then(function (allTabsArr) {
    curTab = allTabsArr[0];
    console.log("new tab");
    let visitingLoginPagePromise = curTab.goto(
      "https://www.hackerrank.com/auth/login"
    );
    return visitingLoginPagePromise;
  })
  .then(function (data) {
    console.log(data);
    console.log("Hackerrank login page opened");
    let emailWillBeTypedPromise = curTab.type("input[name='username']", email, {
      delay: 100,
    });
    return emailWillBeTypedPromise;
  })
  .then(function () {
    console.log("email is typed");
    let passwordWillBeTypedPromise = curTab.type(
      "input[type='password']",
      password
    );
    return passwordWillBeTypedPromise;
  })
  .then(function () {
    console.log("password has been typed");
    let willBeLoggedInPromise = curTab.click(
      ".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"
    );
    return willBeLoggedInPromise;
  })
  .then(function () {
    console.log("logged in to hackerrank successfully");
    let algorithmTabWillBeOpenedPromise = waitandClick(
      "div[data-automation='algorithms']"
    );
    return algorithmTabWillBeOpenedPromise;
  })
  .then(function () {
    console.log("algorihtm pages is opened");
    let allQuespromise = curTab.waitForSelector(
      'a[data-analytics="ChallengeListChallengeName"]'
    );
    return allQuespromise;
  })
  .then(function () {
    function getAllQUesLinks() {
      let allElemArr = document.querySelectorAll(
        'a[data-analytics="ChallengeListChallengeName"]'
      );
      let linksArr = [];
      for (let i = 0; i < allElemArr.length; i++) {
        linksArr.push(allElemArr[i].getAttribute("href"));
      }
      return linksArr;
    }
    let linksArrPromise = curTab.evaluate(getAllQUesLinks);
    return linksArrPromise;
  })
  .then(function (linksArr) {
    console.log("links to all ques received");
    console.log(linksArr);
    let questionWillBeSOlvedPromise = questionSolver(linksArr[0], 0);
    for (let i = 1; i < 4; i++) {
      questionWillBeSOlvedPromise = questionWillBeSOlvedPromise.then(
        function () {
          return questionSolver(linksArr[i], i);
        }
      );
    }
    return questionWillBeSOlvedPromise;
  })
  .then(function () {
    console.log("question is solved");
  })
  .catch(function (err) {
    console.log(err);
  });
function waitandClick(algoBtn) {
  let waitClickpromise = new Promise(function (resolve, reject) {
    let waitForSelectorPromise = curTab.waitForSelector(algoBtn);
    waitForSelectorPromise
      .then(function () {
        console.log("algo btn is found");
        let clickPromise = curTab.click(algoBtn);
        return clickPromise;
      })
      .then(function () {
        console.log("algo btn is clicked");
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
  return waitClickpromise;
}
function questionSolver(url, idx) {
  return new Promise(function (resolve, reject) {
    let fullLink = `https://www.hackerrank.com${url}`;
    let goToQuesPagePromise = curTab.goto(fullLink);
    goToQuesPagePromise
      .then(function () {
        console.log("quetsion opened");
        let waitForCheckBoxAndClickPromise = waitandClick(".checkbox-input");
        return waitForCheckBoxAndClickPromise;
      })
      .then(function () {
        let waitForTextBoxPromise = curTab.waitForSelector(".custominput");
        return waitForTextBoxPromise;
      })
      .then(function () {
        let codeWillBeTypedPromise = curTab.type(".custominput", answer[idx]);
        return codeWillBeTypedPromise;
      })
      .then(function () {
        let controlKeyPressesPromise = curTab.keyboard.down("Control");
        return controlKeyPressesPromise;
      })
      .then(function () {
        let aKeyPressesPromise = curTab.keyboard.press("a");
        return aKeyPressesPromise;
      })
      .then(function () {
        let xKeyPressesPromise = curTab.keyboard.press("x");
        return xKeyPressesPromise;
      })
      .then(function () {
        let ctrlIsReleasedPromise = curTab.keyboard.up("Control");
        return ctrlIsReleasedPromise;
      })
      .then(function () {
        let cursorOnEditorpromise = curTab.click(
          ".monaco-editor.no-user-select.vs"
        );
        return cursorOnEditorpromise;
      })
      .then(function () {
        //control key is pressed promise
        let controlPressedPromise = curTab.keyboard.down("Control");
        return controlPressedPromise;
      })
      .then(function () {
        let aKeyPressesPromise = curTab.keyboard.press("a");
        return aKeyPressesPromise;
      })
      .then(function () {
        let vKeyPressesPromise = curTab.keyboard.press("v");
        return vKeyPressesPromise;
      })
      .then(function () {
        let controlDownPromise = curTab.keyboard.up("Control");
        return controlDownPromise;
      })

      .then(function () {
        let submitButtonClickedPromise = curTab.click(".hr-monaco-submit");
        return submitButtonClickedPromise;
      })

      .then(function () {
        console.log("code submitted successfully");
        resolve();
      })
      .catch(function (err) {
        reject(err);
      });
  });
}
