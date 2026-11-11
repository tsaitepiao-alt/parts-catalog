/* Lesson content is independently authored. Pin mappings are logical teaching examples,
   not the verified layout of the user's not-yet-inspected board. */
window.LAB_LESSONS = [
{id:'intro',title:'認識 ESP32-S3',en:'MEET THE ESP32',category:'共用基礎',kind:'board',heading:'一塊板子，五個產品的起點',desc:'先認識微控制器，再接第一條線。ESP32-S3 負責讀取感測器、執行程式，並透過 Wi-Fi 或 BLE 傳送資料。中央模型可以旋轉、縮放，也可以拆開觀察。',points:['USB 提供電源與程式下載介面。不同板型可能有兩個 USB 埠。','銀色屏蔽罩內是模組；天線區應避免被金屬覆蓋。','GPIO 是邏輯接腳名稱，不是由上到下數的第幾腳。'],pins:[['USB','電腦 USB','先以單一 USB 電源測試'],['3V3','3.3 V 電源','不是 5 V'],['GND','共同接地','訊號的共同參考']],steps:['確認板子完整型號與正反面絲印，先不要接感測器。','Arduino IDE 安裝 Espressif esp32 板卡套件，選對 S3 板型及埠。','上傳右側程式，開啟 115200 baud 序列監控。','確認每秒收到一次訊息，再進行外部接線。'],materials:['ESP32-S3 開發板 × 1','可傳資料的 USB 線 × 1'],specs:[['MCU','ESP32-S3'],['邏輯','3.3 V'],['無線','Wi-Fi / BLE'],['板型','以到貨實物為準']],note:'這是按典型開發板結構製作的示意模型，尺寸、針序與 USB 配置不是到貨板的工程圖。',control:'示範執行速度',unit:'%',code:`void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("JIALAN LAB ready");
}

void loop() {
  Serial.println("Hello ESP32-S3");
  delay(1000);
}`,logs:['USB 電源 → 穩壓 → MCU 啟動','Hello ESP32-S3 · 示範訊息']},
{id:'blink',title:'點亮第一顆 LED',en:'YOUR FIRST CIRCUIT',category:'共用基礎',kind:'led',heading:'電從哪裡來，又從哪裡回去？',desc:'用 GPIO4 控制一顆外接 LED。電流由接腳經過限流電阻與 LED，再回到 GND。看懂這個回路，是後續接線的基本功。',points:['LED 長腳通常是陽極，但剪過腳後要看封裝標記。','每顆 LED 各自串接限流電阻。','點 ▶ 看交替亮滅，調滑桿改變示範速度。'],pins:[['GPIO4','330 Ω → LED 陽極','訊號輸出'],['LED 陰極','GND','閉合電流回路']],steps:['拔除 USB 電源。','GPIO4 → 330 Ω 電阻 → LED 陽極，LED 陰極 → GND。','核對 LED 極性，確認無短路後接上 USB。','上傳程式，應看到 LED 每 500 ms 改變狀態。'],materials:['ESP32-S3 × 1','LED × 1','330 Ω 電阻 × 1','麵包板、杜邦線'],specs:[['輸出腳','GPIO4'],['限流','330 Ω'],['延遲','500 ms'],['電源','USB']],note:'本課使用外接 LED，不假設 S3 板上的 LED 一定接 GPIO2。',control:'閃爍速度',unit:'%',code:`const int LED_PIN = 4;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}`,logs:['GPIO4 = HIGH → LED 亮','GPIO4 = LOW → LED 滅']},
{id:'i2c',title:'I²C 掃描與共用匯流排',en:'TWO WIRES, MANY SENSORS',category:'共用基礎',kind:'imu',heading:'SDA 與 SCL：感測器的共同語言',desc:'I²C 使用資料線 SDA 與時脈線 SCL。MPU6050、MAX30102 等元件可共享匯流排，但每個裝置需要不同位址、合適的供電與上拉。',points:['本課範例指定 SDA=8、SCL=9，須核對實際板型可用腳位。','先單獨接一個模組，再執行掃描。','掃到位址只能證明通訊回應，不代表感測數值準確。'],pins:[['3V3','模組電源','僅限確認支援 3.3 V 的模組'],['GND','模組 GND','共地'],['GPIO8','SDA','資料'],['GPIO9','SCL','時脈']],steps:['確認模組供電規格及上拉電阻所接電壓。','斷電後接好四條線。','上傳掃描程式，序列監控設 115200。','記錄位址；無回應時先量供電、再檢查 SDA/SCL。'],materials:['ESP32-S3 × 1','3.3 V 相容 I²C 模組 × 1','杜邦線 × 4'],specs:[['SDA','GPIO8'],['SCL','GPIO9'],['初始時脈','100 kHz'],['工具','Wire']],note:'模組板上的 VIN、VCC 與晶片電源範圍可能不同，不能只看晶片名稱就決定接 5 V。',control:'示範資料變化',unit:'%',code:`#include <Wire.h>
void setup() {
  Serial.begin(115200);
  Wire.begin(8, 9, 100000);
}
void loop() {
  for (int a = 1; a < 127; a++) {
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0) {
      Serial.printf("Found 0x%02X\\n", a);
    }
  }
  delay(2000);
}`,logs:['I²C 掃描示範：0x68 回應','先核對位址，再進行驅動測試']},
{id:'imu',title:'棒球揮棒感測器',en:'BASENEFIT / MOTION',category:'運動',kind:'imu',heading:'從加速度開始，看見動作',desc:'先用 MPU6050 讀出原始加速度與角速度，驗證接線與取樣。揮棒速度、棒頭軌跡需要額外的座標校正、安裝位置與演算法，不能由一組讀值直接得出。',points:['原型先固定在桌面，記錄靜止基線。','測試旋轉方向與軸向標示是否一致。','MPU6050 是否適合實際揮棒，仍須檢查飽和與取樣率。'],pins:[['3V3 / GND','模組電源 / GND','核對模組相容性'],['GPIO8 / GPIO9','SDA / SCL','I²C'],['AD0','GND','典型位址 0x68']],steps:['完成前一課 I²C 掃描。','執行本課原始資料讀取，確認不是固定全零。','靜置、翻面、緩慢旋轉，觀察三軸變化。','記錄時間戳與原始資料；高衝擊測試前先確認量程與固定結構。'],materials:['ESP32-S3 × 1','MPU6050 模組 × 1','固定座與杜邦線'],specs:[['加速度','3 軸'],['角速度','3 軸'],['範例位址','0x68'],['結果','原始值']],note:'右側程式僅初始化與讀取原始暫存器，不計算揮棒速度。ICM-42688-P 需獨立驅動，不可直接套此程式。',control:'示範旋轉幅度',unit:'%',code:`#include <Wire.h>
const uint8_t IMU = 0x68;
void setup() {
  Serial.begin(115200);
  Wire.begin(8, 9);
  Wire.beginTransmission(IMU);
  Wire.write(0x6B); Wire.write(0);
  Wire.endTransmission();
}
void loop() {
  Wire.beginTransmission(IMU);
  Wire.write(0x3B);
  if (Wire.endTransmission(false)) return;
  if (Wire.requestFrom(IMU, (uint8_t)14) != 14) return;
  for (int i = 0; i < 7; i++) {
    int16_t v = (Wire.read() << 8) | Wire.read();
    Serial.print(v); Serial.print(i == 6 ? '\\n' : ',');
  }
  delay(20);
}`,logs:['模擬 ax / ay / az 資料串流','動作示範中 · 尚未取得實體 IMU 資料']},
{id:'temp',title:'溫度探頭接線',en:'WPCD / TEMPERATURE',category:'寵物',kind:'temp',heading:'量到的是探頭溫度',desc:'DS18B20 可以作為溫度通訊與封裝測試的起點。裝在頸圈上時，接觸面、毛髮、環境與配戴鬆緊都會影響量測。',points:['資料線 DQ 以 4.7 kΩ 上拉至 3.3 V。','探頭線色沒有跨品牌統一規格，要先核對賣家線序。','先與參考溫度計做同環境比對，再評估配戴位置。'],pins:[['3V3','VDD','非寄生供電'],['GPIO4','DQ','4.7 kΩ 上拉至 3V3'],['GND','GND','核對線序']],steps:['Arduino Library Manager 安裝 OneWire、DallasTemperature。','斷電接線並加上拉電阻。','讀取探頭；-127 °C 等錯誤值應先排查接線。','進行室溫及溫水對照，記錄穩定時間與偏差。'],materials:['DS18B20 探頭 × 1','4.7 kΩ 電阻 × 1','ESP32-S3、杜邦線'],specs:[['介面','1-Wire'],['DQ','GPIO4'],['上拉','4.7 kΩ'],['供電範例','3.3 V']],note:'本課不能把頸圈接觸溫度當成核心體溫；尚未經貓隻實測與校準。',control:'示範探頭溫度',unit:'°C',code:`#include <OneWire.h>
#include <DallasTemperature.h>
OneWire bus(4);
DallasTemperature probes(&bus);
void setup() {
  Serial.begin(115200);
  probes.begin();
}
void loop() {
  probes.requestTemperatures();
  Serial.println(probes.getTempCByIndex(0));
  delay(1000);
}`,logs:['1-Wire 探頭讀值示範','記錄接觸溫度 · 不是核心體溫']},
{id:'ble',title:'頸圈 BLE 廣播',en:'WPCD / CONNECT',category:'寵物',kind:'ble',heading:'先讓手機找到你的原型',desc:'先驗證 ESP32-S3 能發出 BLE 廣播。手機使用 BLE 掃描工具尋找 WPCD-Prototype。看到名稱之後，再規劃感測資料特徵值與低功耗週期。',points:['BLE 廣播不同於 Bluetooth Classic 音訊。','測試 1 m、3 m、5 m，記錄可發現率與 RSSI。','不要以 RSSI 直接宣稱精準距離。'],pins:[['USB','電源與下載','本課不需外接感測器']],steps:['在手機安裝可查看 BLE 廣播的掃描工具。','上傳程式，開始掃描 WPCD-Prototype。','改變距離與遮擋，記錄掃描結果。','後續使用電流量測工具實測平均與峰值電流。'],materials:['ESP32-S3 × 1','支援 BLE 的手機 × 1'],specs:[['協定','BLE'],['廣播名','WPCD-Prototype'],['外接線','無'],['功耗','尚待實測']],note:'示範只建立廣播，不包含手機 App、資料服務、GPS 回傳或雲端串接。',control:'示範訊號強度',unit:'%',code:`#include <BLEDevice.h>
void setup() {
  Serial.begin(115200);
  BLEDevice::init("WPCD-Prototype");
  BLEDevice::createServer();
  BLEDevice::getAdvertising()->start();
  Serial.println("BLE advertising started");
}
void loop() {
  delay(1000);
}`,logs:['WPCD-Prototype · BLE 廣播示範','手機掃描 → 發現裝置 → 記錄 RSSI']},
{id:'gps',title:'GPS：TX 與 RX 怎麼接',en:'WPCD / LOCATION',category:'寵物',kind:'gps',heading:'先收到句子，再談定位',desc:'GNSS 模組會透過 UART 輸出資料。先把模組 TX 接到 ESP32 的 RX，確認能收到原始 NMEA 文字，再進行經緯度解析與戶外定位測試。',points:['TX 接 RX，傳送端接接收端。','模組供電與 UART 邏輯電壓是兩件事，必須分別核對。','GPS 只提供位置，遠端回傳還需要另一條網路。'],pins:[['模組 TX','GPIO18（RX）','3.3 V 相容訊號'],['模組 RX','GPIO17（TX）','本課僅讀取時可不接'],['模組 GND','GND','共地'],['模組 VCC','依模組規格','確認供電後再接']],steps:['核對 GNSS 模組電壓、預設鮑率與線序。','斷電交叉接 TX/RX，再供電。','範例使用 9600 baud；必要時依模組設定調整。','移到開闊戶外，觀察有效定位狀態；不要把無定位的句子當座標。'],materials:['GNSS 模組與天線 × 1','ESP32-S3 × 1','杜邦線'],specs:[['介面','UART'],['RX / TX','18 / 17'],['範例鮑率','9600'],['輸出','原始 NMEA']],note:'圖中模組與陶瓷天線為通用示意，實際模組料號與供電仍待核對。',control:'示範接收狀態',unit:'%',code:`HardwareSerial gps(1);
void setup() {
  Serial.begin(115200);
  gps.begin(9600, SERIAL_8N1, 18, 17);
}
void loop() {
  while (gps.available()) {
    Serial.write(gps.read());
  }
}`,logs:['UART RX 接收示範 · 9600 baud','NMEA 資料 ≠ 已有有效定位']},
{id:'pulse',title:'光學感測的第一關',en:'WPCD / OPTICAL SENSOR',category:'寵物',kind:'pulse',heading:'先驗證訊號，不先承諾心率',desc:'MAX30102 是光學感測晶片。貓的毛髮、皮膚接觸與動作都可能使訊號失真。第一步只確認模組通訊與訊號品質，不能直接把範例數字當成心率、血氧或應激程度。',points:['先檢查 I²C 回應，再讀晶片識別暫存器。','後續需設定 LED 電流、FIFO 與取樣率，再取得波形。','任何貓用生理量測均尚待驗證，UI 不顯示假心率。'],pins:[['模組電源','依模組標示','確認穩壓與電平轉換'],['GND','GND','共地'],['SDA / SCL','GPIO8 / GPIO9','確認 3.3 V 邏輯相容']],steps:['核對 MAX30102 模組原理圖、供電和上拉。','執行識別暫存器讀取，不接觸動物先排除通訊問題。','後續新增經核對的驅動與波形輸出。','進行靜止、移動與遮光對照，再決定是否適合頸圈。'],materials:['MAX30102 模組 × 1','ESP32-S3 × 1','遮光測試治具'],specs:[['介面','I²C'],['典型位址','0x57'],['本課讀取','PART_ID'],['生理指標','未驗證']],note:'目前程式僅讀晶片識別，不是可用的心率或血氧演算法。',control:'示範動作干擾',unit:'%',code:`#include <Wire.h>
void setup() {
  Serial.begin(115200);
  Wire.begin(8, 9);
}
void loop() {
  Wire.beginTransmission(0x57);
  Wire.write(0xFF); // PART_ID
  if (Wire.endTransmission(false) == 0 &&
      Wire.requestFrom(0x57, 1) == 1) {
    Serial.printf("PART_ID: 0x%02X\\n", Wire.read());
  } else Serial.println("No response");
  delay(1000);
}`,logs:['光學模組通訊示範 · 尚無生理讀值','動作干擾需實測 · 不推算應激程度']},
{id:'speaker',title:'藍牙音箱組裝架構',en:'HOME / BLUETOOTH AUDIO',category:'居家',kind:'speaker',heading:'音訊交給音訊板，控制交給 MCU',desc:'使用你規劃的藍牙功放一體板與 4 Ω / 3 W 喇叭，先做獨立播放測試。ESP32-S3 不支援 Bluetooth Classic A2DP，不能直接當一般手機藍牙音箱接收端。',points:['手機 → 藍牙音訊板 → 功放 → 喇叭。','若模組是 BTL 輸出，喇叭負端不能接 GND。','本課是接線規劃，需先確認功放板的實際型號與額定電源。'],pins:[['電源 + / −','功放板電源端','電壓、極性依料號'],['L+ / L−','左聲道喇叭','依實際板型'],['R+ / R−','右聲道喇叭','不可自行共接負端']],steps:['拍攝功放板兩面，確認型號、供電與輸出標記。','在斷電下接喇叭，量測無短路。','用符合規格的限流電源供電，手機配對並從小音量開始。','記錄失真、發熱與待機電流；再設計 3D 列印箱體。'],materials:['藍牙功放一體板 × 1','4 Ω / 3 W 喇叭 × 2','符合模組規格的電源'],specs:[['MCU','非音訊必需'],['訊源','手機藍牙'],['功放','型號待確認'],['負載','依板型核對']],note:'示意模型不定義未知模組的供電與焊盤位置；不要直接按模型焊接。',control:'示範播放音量',unit:'%',codeType:'接線規劃 / 非可執行程式',code:`手機
  └─ Bluetooth 音訊
       └─ 藍牙功放一體板
            ├─ L+ / L− → 左喇叭
            └─ R+ / R− → 右喇叭

電源：依實際模組額定值選擇
控制：另行確認是否有按鍵 / UART
注意：先核對 BTL，不共接喇叭負端`,logs:['示範音訊路徑 · 不播放真實音訊','功放與喇叭配對尚待實機驗證']},
{id:'fire',title:'消防：溫感警示原型',en:'FIRE / EARLY WARNING',category:'消防',kind:'temp',heading:'先完成低壓警示驗證',desc:'用桌面溫度情境驗證「讀取 → 閾值 → 警示」流程。這一課只示範狀態判斷，不連接配電箱、不切斷市電。正式消防產品還需要感測選型、故障模式與合規驗證。',points:['溫度示範使用可調參數，不代表電箱合理警戒值。','量測失效也應有故障提示。','控制輸出應先使用 LED 等低壓負載驗證。'],pins:[['溫度感測器','先依溫度課接線','後續替換為適用料件'],['警示輸出','先用序列訊息','尚未設計斷電控制']],steps:['先完成溫度探頭通訊。','調整示範溫度，觀察警示狀態。','後續加入遲滯、斷線檢測與故障安全設計。','把原型結果交由合格電氣與消防專業人員評估。'],materials:['ESP32-S3、溫度感測器','低壓 LED 警示負載（後續）'],specs:[['原型電源','USB 低壓'],['監測','溫度情境'],['斷電器','未實作'],['產品狀態','概念驗證']],note:'這不是可裝進配電箱使用的消防設備。',control:'示範環境溫度',unit:'°C',codeType:'流程規劃 / 非韌體',code:`讀取溫度
  ├─ 無效 → 感測器故障提示
  └─ 有效 → 記錄時間與數值
              ├─ 超過測試閾值 → 警示
              └─ 回到復歸範圍 → 解除

下一步：驗證遲滯、斷線與供電失效
實體斷電控制尚未實作`,logs:['低壓溫感流程示範','僅桌面驗證 · 無市電控制']},
{id:'cane',title:'長照：智慧拐杖感測',en:'CARE / MOTION AWARENESS',category:'長照',kind:'imu',heading:'先記錄動作，再驗證判斷',desc:'用 IMU 記錄拐杖的傾斜、碰撞與靜止狀態。跌倒辨識需要標註資料、誤報分析和真人使用驗證，單一加速度閾值不等於可靠救援功能。',points:['固定位置會改變資料，要先定義安裝方向。','放下拐杖、碰撞、走路，都可能造成類似訊號。','原型先記錄資料，不自動呼叫救護或傳送通知。'],pins:[['SDA / SCL','GPIO8 / GPIO9','同 IMU 課'],['電源與地','依模組規格','本課不接電池充電電路']],steps:['完成 IMU 課的原始資料讀取。','固定在模型拐杖，建立軸向與姿態基準。','收集走路、放置與碰撞資料並標記情境。','計算誤報與漏報，才進入通知機制驗證。'],materials:['ESP32-S3、IMU 模組','固定治具與桌面測試架'],specs:[['輸入','6 軸動作'],['輸出','事件紀錄'],['跌倒判定','尚待驗證'],['緊急通知','未串接']],note:'此原型不能作為醫療或緊急救援的唯一依據。',control:'示範傾斜幅度',unit:'%',codeType:'驗證規劃 / 非韌體',code:`初始化 IMU
建立靜止基線
循環記錄：
  時間戳、ax、ay、az、gx、gy、gz

人工標記：
  走路 / 放下 / 撞擊 / 傾倒

分析誤報與漏報
確認後再設計事件通知`,logs:['拐杖動作紀錄示範','不輸出已確認跌倒 · 不發送緊急訊息']},
{id:'collar',title:'WPCD 頸圈整合與分解',en:'WPCD / PRODUCT PROTOTYPE',category:'寵物',kind:'collar',heading:'讓每一層，都有驗證的理由',desc:'把主控、感測、外殼與固定帶放進同一個結構構想。點「分解」觀察層次；先做桌面原型，再逐步縮小、降功耗與驗證配戴舒適度。',points:['原型順序：通訊 → 個別感測 → 耗電 → 結構 → 配戴。','定位、心率、體溫與應激都仍是規劃功能，沒有實測即不算完成。','安全快脫、重量、邊緣與防水需要獨立測試。'],pins:[['I²C','SDA / SCL 共用','先處理位址與上拉'],['UART','GNSS TX → MCU RX','核對邏輯電壓'],['電源','另立電池與充電設計','本版僅桌面 USB 驗證']],steps:['完成 BLE 基礎廣播與 I²C 通訊。','各模組單獨測試，保存原始資料。','逐項整合並量測平均、峰值電流與續航。','依實物尺寸重建外殼，再驗證固定、重量與快脫結構。'],materials:['ESP32-S3 與已驗證模組','3D 列印結構樣件','固定帶、桌面供電'],specs:[['主控','ESP32-S3 原型'],['外殼','概念分層'],['配戴測試','未回報'],['量產設計','未完成']],note:'分解圖是概念結構，不是精準打樣 CAD；電池保護與充電電路尚未設計。',control:'示範活動幅度',unit:'%',codeType:'整合驗證清單 / 非韌體',code:`WPCD Prototype Checkpoint
[ ] BLE 發現率與遮擋測試
[ ] IMU 原始資料穩定性
[ ] GNSS 戶外有效定位
[ ] 接觸溫度偏差與延遲
[ ] 光學波形可用性
[ ] 峰值 / 平均電流
[ ] 重量 / 固定 / 快脫機構
[ ] 防水與充電設計

沒有測試紀錄，不標記成功。`,logs:['WPCD 系統架構教學示範','桌面驗證 → 結構迭代 → 配戴評估']}
];
window.LAB_PARTS = [
{name:'ESP32-S3 N16R8',type:'主控開發板',detail:'Wi-Fi / BLE 主控；N16R8 標示須依模組與板型核實。',lesson:'intro'},
{name:'MPU6050',type:'動作感測器',detail:'六軸 IMU，先用於桌面資料讀取與軸向測試。',lesson:'imu'},
{name:'ICM-42688-P',type:'動作感測器',detail:'需另選量程、取樣率與驅動；尚未加入專用教學模型。',lesson:'imu'},
{name:'MAX30102',type:'光學感測模組',detail:'先驗證通訊與波形，貓用心率與血氧尚未驗證。',lesson:'pulse'},
{name:'DS18B20',type:'溫度探頭',detail:'1-Wire 介面，DQ 需上拉，線色依供應商核對。',lesson:'temp'},
{name:'GPS / GNSS 模組',type:'定位',detail:'先核對供電、UART 電平、預設鮑率與天線。',lesson:'gps'},
{name:'藍牙功放一體板',type:'音訊模組',detail:'實際板型待確認，供電與輸出不可依通用模型猜測。',lesson:'speaker'},
{name:'4 Ω / 3 W 喇叭',type:'聲學元件',detail:'須與功放輸出規格匹配，箱體需做聲學與散熱測試。',lesson:'speaker'}
];
