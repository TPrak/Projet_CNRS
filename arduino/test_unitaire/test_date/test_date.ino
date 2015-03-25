#include <stdlib.h>
#include <stdio.h>
#include <Bridge.h>
#include <string.h>
#include <Time.h>

void setup() {
  // put your setup code here, to run once:
  Bridge.begin();
  Serial.begin(9600);
  while(!Serial);      
}

void loop() {
  
  Process startTime;
  String date,heure;
  startTime.runShellCommand("date '+%Y-%m-%d' ");
  while(startTime.available())
  {
    char c = startTime.read();
    date+= c;
  }
  startTime.runShellCommand("date '+%H:%M:%S' ");
  while(startTime.available())
  {
    char c = startTime.read();
    heure+= c;
  }
   
Serial.println(date);
Serial.println(heure);


//setTime(heure,minutes,seconde,jour,mois,annee);
//int test2 = atoi(test[3]);
delay(10000);
}


