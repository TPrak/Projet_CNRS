#include <Bridge.h>
#include <HttpClient.h>
HttpClient client;
String urlServeur = "http://perso.imerir.com/cpy/CNRS/server_synchro.php";
Process readDB,updateDB ;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  while (!Serial);

  //partie clients http
  pinMode(13, OUTPUT);
  digitalWrite(13, LOW);
  Bridge.begin();

}

void loop() {
  // put your main code here, to run repeatedly:
  synchData();
  Serial.println("done");
  while (1);
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
  readDB.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"select * from donnees where flag = 0 ;\"");
  while (readDB.running());

  // Read command output. runShellCommand()
  while (readDB.available() > 0) {
    char c = readDB.read();
    if (c != '\0' && c != '\n' && c != '\r')
      ligne += c;
    else
    {
      String url = "";

      Serial.println(ligne);
      Serial.println("");
      //parsing line
      int indexIdDonnee  = ligne.indexOf('|');
      int indexIdcapteur = ligne.indexOf('|', indexIdDonnee );
      int indexVal       = ligne.indexOf('|', indexIdcapteur +1);
      int indexDtTime    = ligne.indexOf('|', indexVal +1);
      int indexFlag      = ligne.indexOf('|', indexDtTime +1);
      
      Serial.println("index idDonnee " + (String)indexIdDonnee );
      Serial.println("index idCapteur " + (String)indexIdcapteur );
      Serial.println("index val " + (String)indexVal );
      Serial.println("index dtTime " + (String)indexDtTime );
      Serial.println("index flag " + (String)indexFlag );
      Serial.println("");
      
      int idDonnee  = ligne.substring(0, indexIdDonnee ).toInt();
      int idCapteur = ligne.substring(indexIdcapteur +1, indexVal ).toInt();
      float val       = ligne.substring(indexVal+1, indexDtTime ).toFloat();
      String dateTime  = ligne.substring(indexDtTime +1 , indexFlag );
      dateTime.replace(' ', '_');
      dateTime.replace(':', '-');
      
      Serial.println("idDonnee = " + (String)idDonnee );
      Serial.println("idCapteur = " + (String)idCapteur );
      Serial.println("val = " + (String)val );
      Serial.println("dtTime = " + (String)dateTime );
      Serial.println("");
      url = createurDeRequete(idCapteur, val, dateTime);
      Serial.println(url);
      String rep;
      client.get(url);
      while (client.available()) {
        char c = client.read();
        rep += c;
      }
      Serial.println(rep);
      if (rep == "1")
      {
        //update the flag of the current line

        updateDB.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \" update donnees set flag=1 where idDonnee =" + (String)idDonnee + ";\"");
        while (updateDB.running());

      }

      //
      ligne = "";
    }
  }//end of loop row in local DB
  //p.runShellCommand("/usr/bin/sqlite3 /mnt/sda1/data/cnrs.db \"delete from donnees where flag=1 \"");
  //while (p.running());
}
