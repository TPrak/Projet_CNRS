#include <Process.h>
#include <Bridge.h>
void setup() {
 Bridge.begin();  // Initialize Bridge
 Serial.begin(9600); 
  while(!Serial); 

}

void loop() {

 Process p;              
// p.begin("/mnt/sda1/scripts/disablewifi.sh");      
// p.run();
 testCo();
 delay(5000);
 p.begin("/mnt/sda1/scripts/enablewifi.sh");      
 p.run();
 testCo();
 delay(5000);
 
}

void testCo()
{
  String ifconfig="";
  Process p; 
  p.runShellCommand("ifconfig");
 while(p.available())
  {
    char c = p.read();
   // if(c != '\0' && c!='\n' && c!='\r')
      ifconfig+= c;
    
  }
   Serial.println(ifconfig);
}

