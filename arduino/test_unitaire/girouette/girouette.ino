void setup() {
  // put your setup code here, to run once:
 pinMode(A4,INPUT);
 digitalWrite(A4, HIGH);  // set pullup on analog pin analog 4 for weathercock
 Serial.begin(9600);
 while (!Serial);
}

void loop() {

  // put your main code here, to run repeatedly:
  Serial.println(getDirectionVent());
  delay(1000);
}
String getDirectionVent()
{
  String directionVent;
  unsigned int val = analogRead(A4);
  Serial.println(val);
 
   if(val>=390 && val <=500)
   {
      directionVent = "N";
   }
   else if(val >=197 && val<=210)
   {
      directionVent = "NE";
   }
 
    else if(val >=34 && val<=45)
   {
      directionVent = "E";
    }
 
    else if(val >=50 && val<=76)
   {
      directionVent = "SE";
   }
 
    else if(val >=90 && val<=120)
   {
      directionVent = "S";
   }
 
    else if(val >=300 && val<=345)
   {
      directionVent = "SO";
    }
 
    else if(val >=549 && val<=670)
   {
      directionVent = "NO";
    }
 
     else if(val >=670 && val<=790)
   {
      directionVent = "O";
    }
  
  return directionVent;
}
