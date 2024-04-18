class Start extends Scene {
    create() {
        console.log(this.engine.storyData.Credits);
        //console.log(this.engine.storyData.Locations.Kresge.Choices[0].Target);
        
        this.engine.setTitle("Mysterious House"); 
        this.engine.addChoice("Begin the story");
    }

    handleChoice(nextscene) {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);
        let imsmart = false;
        if(locationData.Choices) {
            for(let choices of locationData.Choices) { 
                if (choices.Text == "Use Item" || choices.Text == "Secret Door"){if(imsmart == true){this.engine.addChoice(choices.Text,choices,locationData,this.engine);}}
                else if (choices.Searched != true) this.engine.addChoice(choices.Text,choices,locationData,this.engine); 
                else imsmart = true;
            }
        } else {    
            this.engine.addChoice("The end.");
        } 
        
        
    }
    

    handleChoice(choice,locationData) {
        
        let printstuff = function(scenep){
            if(locationData.Choices) {
                let hasitem = false;
                for(let choices of locationData.Choices) {
                    if (choices.Action == "Use Item" || choices.Text == "Secret Door"){if(hasitem == true){scenep.engine.addChoice(choices.Text,choices,locationData);}}
                    else if (choices.Searched != true) scenep.engine.addChoice(choices.Text,choices,locationData); 
                    else hasitem = true;
                }
            } else {    
                scenep.engine.addChoice("The end.");
            }

        };
        if (choice.Action == "Search"){
            this.engine.show("&gt; Found: "+choice.Items);
            if (choice.Items == "A Key!"){
                if (choice.keynum == 1){
                    this.engine.storyData.Locations.MainRoom.Choices[5].Key1 = true;
                }
                else this.engine.storyData.Locations.MainRoom.Choices[5].Key2 = true;
            }
            choice.Searched = true; 
            printstuff(this);
            
        }
        else if (choice.Action == "Use Item") {
            this.engine.show("&gt; It reads: "+choice.DocumentStuff);
            printstuff(this);
        }
        else if (choice.Action == "Poop") {
            this.engine.show("&gt;"+choice.Document);
            printstuff(this);
        }
        else if (choice.Action == "WinGame"){
            if (this.engine.storyData.Locations.MainRoom.Choices[5].Key1 == true){
                if (this.engine.storyData.Locations.MainRoom.Choices[5].Key2 == true){
                    this.engine.gotoScene(Location, choice.Target);
                }
                else{
                 this.engine.show("&gt; "+choice.ErrorMessage);
                 printstuff(this);
                }
            }
            else {
                this.engine.show("&gt; "+choice.ErrorMessage);
                printstuff(this);
        }



        }
        else if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        }
        else {
            this.engine.gotoScene(End);
        }
    }

    


}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');