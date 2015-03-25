// Example testing sketch for various DHT humidity/temperature sensors
// Written by ladyada, public domain
#include <Bridge.h>
#include <Time.h>
#include <Wire.h>
#include <string.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP085_U.h>
#include <HttpClient.h>
#include "DHT.h"
#define DHTPIN 8     // what pin the dht sensor is connected to
#define DHTTYPE DHT11   // define the type DHT 11 
Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10085);
// Initialize DHT sensor for normal 16mhz Arduino
DHT dht(DHTPIN, DHTTYPE);

//variables globales
HttpClient client;

String urlServeur = "http://perso.imerir.com/cpy/CNRS/server_arduino.php";
String urlSynchro = "http://perso.imerir.com/cpy/CNRS/server_synchro.php";
Process p, time;
const float coeff_division = 3.1;
unsigned short int /*pluviometre = 4,*/ anemometre = 3;
//unsigned int comptP = 0 ;
unsigned int comptA = 0;


void setup() {
  Serial.begin(9600);
  while (!Serial);
  //partie clients http
  pinMode(13, OUTPUT);
  digitalWrite(13, LOW);
  Bridge.begin();

  //capteur humidite
  dht.begin();
  /* Initialise the sensor */
  if (!bmp.begin())
  {
    /* There was a problem detecting the BMP085 ... check your connections */
    Serial.print("Ooops, no BMP085 detected ... Check your wiring or I2C ADDR!");
    while (1);
  }
  pinMode(A4, INPUT);
  digitalWrite(A4, HIGH);  // set pullup on analog pin 4 for weathercock

  pinMode(7, INPUT);           // set pin to input
  digitalWrite(7, HIGH);       // turn on pullup resistors for the anemometer
  /*
    pinMode(1, INPUT);           // set pin to input
    digitalWrite(1, HIGH);       // turn on pullup resistors rainometer
  */
  // attachInterrupt(pluviometre, comptageP, RISING) ;
  attachInterrupt(anemometre, comptageA, RISING) ;

  //Serial.println("fin loop");
}



void loop() {
  // Wait between measurements.
  //delay(900000);//15 min

  delay(2000);

  //activate wifi

  //  p.begin("/mnt/sda1/scripts/enablewifi.sh");
  //  p.run();
  //  wait for reconnection
  //  Serial.println("attente 30 sec");
  //  delay(30000);//30 seconds

  //Serial.println("debut lecture capteurs");
  String date = getDate();
  String heure = getHeure();
  //Serial.println(date);
  //Serial.println(heure);
  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old'
  float h = dht.readHumidity();
  // Read temperature as Celsius
  float t = dht.readTemperature();
  // Read temperature as Fahrenheit
  float f = dht.readTemperature(true);
  //Serial.println(h);
  //Serial.println(t);
  //Serial.println(f);
  /* Mesure de la tension brute */
  //  unsigned int raw_bat = analogRead(A0);
  /* Calcul de la tension réel */
  //  float real_bat = ((raw_bat * (5.0 / 1024)) * coeff_division);
  float real_bat = 100;
  //read the wind speed average
  float fvent = (comptA * 2.4) / 900;
  //reset the counter
  comptA = 0;
  //Serial.println(real_bat);
  //Serial.println(fvent);
  /* //read the amount of rain felt
   float pluie = (comptP / 6) * 0.2794;
   //reset the counter
   comptP = 0;
  */
  unsigned short int dvent = analogRead(A4);
  //Serial.println(dvent);
  // Check if any reads failed and exit early (to try again).
  //  if (isnan(h) || isnan(t) || isnan(f)) {
  //    //Serial.println("Failed to read from DHT sensor!");
  //    //manage the error
  //    return;
  //  }
  /* Get a new sensor event for the pressure */
  sensors_event_t event;
  bmp.getEvent(&event);
  //error with the pressure sensor
  //  if (!event.pressure)
  //  {
  //    //managed the error
  //    // Serial.println("Failed to read from pressure sensor!");
  //    return;
  //  }
  //  Serial.println(p);
  //  Serial.println(t);
  //  Serial.println(h);
  //  Serial.println(fvent);
  //  Serial.println(dvent);
  //  Serial.println(real_bat);
  //  Serial.println(date);
  //  Serial.println(heure);


  //test the connection
  if (testWifi())
  {
    //Serial.println("test wifi ok");
    //send the data from the local db to the distant db
    synchData();

    //requette http
    String url = createurDeRequete( p,  t,  h,  fvent,  dvent,  /*pluie,*/ real_bat,  date,  heure);

    String rep;
    client.get(url);
    while (client.available()) {
      char c = client.read();
      rep += c;
    }
    //Serial.println(rep);
    //Serial.flush();
  }
  else
  {
    //Serial.println("test wifi pas ok");
    //send the data on the local base
    p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"insert into donnees(id_capteur,val,date_time,flag) values (1," + (String)h + ",datetime('now'),0) ;\"");
    while (p.running());
    p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"insert into donnees(id_capteur,val,date_time,flag) values (2," + (String)event.pressure + ",datetime('now'),0) ;\"");
    while (p.running());
    p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"insert into donnees(id_capteur,val,date_time,flag) values (3," + (String)t + ",datetime('now'),0) ;\"");
    while (p.running());
    p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"insert into donnees(id_capteur,val,date_time,flag) values (4," + (String)real_bat + ",datetime('now'),0) ;\"");
    while (p.running());
    p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"insert into donnees(id_capteur,val,date_time,flag) values (5," + (String)fvent + ",datetime('now'),0) ;\"");
    while (p.running());
    p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"insert into donnees(id_capteur,val,date_time,flag) values (6," + (String)dvent + ",datetime('now'),0) ;\"");
    while (p.running());
    /* p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"insert into donnees(id_capteur,val,date_time,flag) values (7," + (String)pluie + ",datetime('now'),0) ;\"");
     while (p.running());
     */

  }
  //  Serial.println("desactivation du wifi");
  //disable wifi
  /*  p.begin("/mnt/sda1/scripts/disablewifi.sh");
    p.run();*/
}

//recuperer la date
String getDate()
{
  String date;
  p.runShellCommand("date '+%Y-%m-%d' ");
  while (time.available())
  {
    char c = time.read();
    if (c != '\0' && c != '\n' && c != '\r')
      date += c;

  }
  //Serial.println("fonction date " + date);
  return date;
}

//recuperer l'heure
String getHeure()
{
  String heure = "";
  p.runShellCommand("date '+%H_%M_%S' ");
  while (time.available())
  {
    char c = time.read();
    //echaper les caractère de retour à la ligne
    if (c != '\0' && c != '\n' && c != '\r')
      heure += c;

  }
 // Serial.println("fonction heure " + heure);
  return heure;

}

bool testWifi()
{
  String result;


  p.runShellCommand("ping -w 4 perso.imerir.com | grep packet | cut -d' ' -f7");  // command you want to run
  // while there's any characters coming back from the
  // process, print them to the serial monitor:
  while (p.available() > 0) {
    char c = p.read();
    result += c;
  }
  //parsing the answer
  if (result == "0%" || result == "25%")
    return true;
  else
    return false;

}

String createurDeRequete(float p, float t, float h, float fvent, unsigned short int dvent,/* float pluie,*/float real_bat, String date, String heure)
{
  String url = urlServeur;
  url += String("?pression=");
  url += String(p);
  url += String("&date=");
  url += String(date);
  url += String("&humidite=");
  url += String(h);
  url += String("&heure=");
  url += String(heure);
  url += String("&fvent=");
  url += String(fvent);
  url += String("&dvent=");
  url += String(dvent);
  url += String("&batterie=");
  url += String(real_bat);
  url += String("&temp=");
  url += String(t);
  /*
  url += String("&pluie=");
  url += String(pluie);
  */
  return url;
}
String createurDeRequete(int idCapteur, int val, String dateTime)
{
  String url = urlServeur;
  url += String("?idcapteur=");
  url += String(idCapteur);
  url += String("&val=");
  url += String(val);
  url += String("&date=");
  url += String(dateTime);

  return url;
}

void synchData()
{
  String ligne = "";

  //get all the unsync data from the local DB
  p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"select * from donnees where flag = 0 ;\"");
  while (p.running());

  // Read command output. runShellCommand()
  while (p.available() > 0) {
    char c = p.read();
    if (c != '\0' && c != '\n' && c != '\r')
      ligne += c;
    else
    {
      String url = "";
      /****send the data to the distant DB****/
      //Serial.println(ligne);
      //parsing line
      unsigned short int indexIdDonnee  = ligne.indexOf('|');
      unsigned short int indexIdcapteur = ligne.indexOf('|', indexIdDonnee + 1);
      unsigned short int indexVal       = ligne.indexOf('|', indexIdcapteur + 1);
      unsigned short int indexDtTime    = ligne.indexOf('|', indexVal + 1);
      unsigned short int indexFlag      = ligne.indexOf('|', indexDtTime + 1);

      unsigned short int idDonnee  = ligne.substring(0, indexIdDonnee ).toInt();
      unsigned short int idCapteur = ligne.substring(indexIdcapteur + 1, indexVal ).toInt();
      float val                    = ligne.substring(indexVal + 1, indexDtTime ).toFloat();
      String dateTime              = ligne.substring(indexDtTime + 1 , indexFlag );
      dateTime.replace(' ', '_');
      dateTime.replace(':', '-');
      url = createurDeRequete(idCapteur, val, dateTime);

      String rep;
      client.get(url);
      while (client.available()) {
        char c = client.read();
        rep += c;
      }
      if (rep == "1")
      {
        //update the flag of the current line

        time.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \" update donnees set flag=1 where idDonnee =" + (String)idDonnee + ";\"");
        while (time.running());

      }

      //
      ligne = "";
    }
  }//end of loop row in local DB
  p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"delete from donnees where flag=1 \"");
  while (p.running());
}

void comptageA()
{

  comptA ++ ;
}
/*void comptageP()
{

  comptP ++ ;
}*/
/*String getDirectionVent()
{
  String directionVent;
  unsigned int val = analogRead(A4);


  if (val >= 390 && val <= 500)
  {
    directionVent = "N";
  }
  else if (val >= 197 && val <= 210)
  {
    directionVent = "NE";
  }

  else if (val >= 34 && val <= 45)
  {
    directionVent = "E";
  }

  else if (val >= 50 && val <= 76)
  {
    directionVent = "SE";
  }

  else if (val >= 90 && val <= 120)
  {
    directionVent = "S";
  }

  else if (val >= 300 && val <= 345)
  {
    directionVent = "SO";
  }

  else if (val >= 549 && val <= 670)
  {
    directionVent = "NO";
  }

  else if (val >= 670 && val <= 790)
  {
    directionVent = "O";
  }

  return directionVent;
}*/
