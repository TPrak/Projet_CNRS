
    int pluivometre= 4 ; 
    int anemometre = 3;
    int comptP=0 ;
    int comptA =0;

    void setup()
    {
    Serial.begin(115200) ;
    pinMode(7, INPUT);           // set pin to input
    digitalWrite(7, HIGH);       // turn on pullup resistors
    
    pinMode(1, INPUT);           // set pin to input
    digitalWrite(1, HIGH);       // turn on pullup resistors
    attachInterrupt(pluivometre,comptageP,RISING) ; 
    attachInterrupt(anemometre,comptageA,RISING) ; 
    }
    void loop()
    {
    Serial.print("anemo ");Serial.println(comptA) ;
    Serial.print("pluivio  ");Serial.println(comptP) ;
    delay(1000) ;
    }
    void comptageA()
    {
      
    comptA ++ ;
    }
    void comptageP()
    {
      
    comptP ++ ;
    }
    

