import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"; 

export default function Home() {
  // ประกาศตัวแปร (State)ำถ
  // value: เอาไว้เก็บข้อความที่เรากำลังพิมพ์ในช่อง Input
  const [value, setValue] = useState("");
  // animalName: เอาไว้เก็บชื่อสัตว์ที่จะโชว์บนหน้าจอ (ที่อ่านมาจากเมมโมรี่หรือที่เพิ่งเซฟ)
  const [animalName, setAnimalName] = useState("");

  // --- ส่วนทำงานอัตโนมัติ (Effect) ---
  // useEffect ตัวนี้จะทำงาน "แค่ครั้งเดียว" ตอนเปิดหน้านี้ขึ้นมา
  // หน้าที่คือ: สั่งให้ไปดึงข้อมูลเก่าที่เคยเซฟไว้มาโชว์
  useEffect(() => {
    loadAnimal();
  }, []);

  // --- ฟังก์ชัน 1: บันทึกข้อมูล (Save) ---
  async function saveAnimal() {
    
      // 1. สั่งบันทึกลงความจำเครื่อง (Key="animal", Value=ค่าที่พิมพ์)
      // ต้องมี await เพื่อรอให้บันทึกเสร็จก่อน ถึงจะไปบรรทัดถัดไป
      await AsyncStorage.setItem("animal", value);
      
      // 2. อัปเดตตัวแปร animalName เพื่อให้หน้าจอเปลี่ยนข้อความทันที
      setAnimalName(value);
      
      // 3. เคลียร์ช่องพิมพ์ให้ว่างเปล่า
      setValue(""); 
    
    
  }

  // --- ฟังก์ชัน 2: โหลดข้อมูล (Load) ---
  async function loadAnimal() {
    
      // 1. ไปดึงข้อมูลจาก Key ที่ชื่อ "animal"
      const a = await AsyncStorage.getItem("animal");
      
      // 2. เช็คว่าเจอมั้ย? (ถ้าเปิดแอปครั้งแรกจะไม่เจอ ค่าจะเป็น null   null  คือค่าว่างเปล่า)
      if (a === null) {
        setAnimalName("My me"); // ถ้าไม่เจอ ให้ตั้งค่าเริ่มต้น
      } else {
        setAnimalName(a); // ถ้าเจอ ให้เอาค่าที่เจอมาใส่ ค่าที่เจอคือตัวแปร a
      }
    
  }

  // --- ฟังก์ชัน 3: ลบข้อมูล (Remove) ---
  async function removeAnimal() {
    
      // 1. สั่งลบข้อมูลใน Key "animal" ทิ้งไปเลย
      await AsyncStorage.removeItem("animal");
      
      // 2. เปลี่ยนข้อความหน้าจอให้รู้ว่าลบแล้ว
      setAnimalName("ยังไม่เซฟ"); 
    
    
  }

  // --- ส่วนแสดงผลหน้าจอ (Render) ---
  return (
    <View style={myStyles.container}>
      
      {/* ส่วนโชว์ข้อความ: เอาค่า animalName มาแสดง */}
      <Text style={{ marginBottom: 20, fontSize: 18 }}>
        Animal : {animalName}
      </Text>

      {/* ช่องพิมพ์ข้อความ */}
      <TextInput 
        style={myStyles.input} 
        value={value}             // ผูกค่ากับตัวแปร value
        onChangeText={setValue}   // พิมพ์ปุ๊บ อัปเดตตัวแปร value ปั๊บ
        placeholder="พิมพ์ชื่อสัตว์" 
      />

      {/* ปุ่มกด Save: กดแล้วเรียกฟังก์ชัน saveAnimal */}
      <TouchableOpacity onPress={saveAnimal} style={myStyles.button}>
        <Text style={{ color: 'white' }}>Save</Text>
      </TouchableOpacity>

      {/* ปุ่มกด Remove: กดแล้วเรียกฟังก์ชัน removeAnimal */}
      {/* ตรงนี้มีการใช้ Style 2 ตัวผสมกัน (array) เพื่อเปลี่ยนสีปุ่มเป็นแดง  array การเอาสตาย2ตัวผสมกัน แม่แบบ กับ ตัวแก้*/}
      <TouchableOpacity onPress={removeAnimal} 
      style={[myStyles.button, { backgroundColor: 'red', marginTop: 10 }]} //เว้นระยะห้างระหว่างปุ่ม แดง ฟ้า
      >
        <Text style={{ color: 'white' }}>Removee</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- ส่วนตกแต่ง ---
const myStyles = StyleSheet.create({
  container: {
    flex: 1,                // ขยายเต็มจอ
    justifyContent: 'center', // จัดของให้อยู่กึ่งกลางแนวตั้ง
    alignItems: 'center',     // จัดของให้อยู่กึ่งกลางแนวนอน
    padding: 20,            // เว้นขอบเข้ามาหน่อย
  },
  input: {
    borderWidth: 1,         // เส้นขอบหนา 1
    borderColor: '#ccc',    // สีเส้นขอบเทาๆ
    width: '80%',           // ความกว้าง 80% ของหน้าจอ
    padding: 10,            // ระยะห่างตัวหนังสือกับกรอบ
    marginBottom: 20,       // เว้นระยะห่างด้านล่าง
    borderRadius: 5,        // ทำมุมมนๆ
  },
  button: {
    backgroundColor: 'skyblue', // สีพื้นหลังปุ่ม
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',     // จัดตัวหนังสือในปุ่มให้อยู่ตรงกลาง
  }
});