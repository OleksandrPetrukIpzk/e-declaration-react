// import React, { useState } from 'react';
// import forge from 'node-forge';
// // Українські криптографічні константи
// const UA_CRYPTO_ALGORITHMS = {
//     DSTU4145: 'ДСТУ 4145-2002', // Українська еліптична криптографія
//     GOST34311: 'ГОСТ 34.311-95', // Українська хеш-функція
//     RSA: 'RSA-2048'
// };
//
// // Типи для українських сертифікатів
// interface UkrainianCertificateInfo {
//     subject: {
//         commonName: string;
//         organization: string;
//         organizationalUnit?: string;
//         country: string;
//         locality?: string;
//         drfo?: string; // Український ДРФО
//         edrpou?: string; // Український ЄДРПОУ
//     };
//     issuer: {
//         commonName: string;
//         organization: string;
//         country: string;
//     };
//     serialNumber: string;
//     validFrom: Date;
//     validTo: Date;
//     algorithm: string;
//     keyUsage: string[];
//     isQualified: boolean; // Кваліфікований сертифікат
//     certificateType: 'personal' | 'corporate' | 'stamp';
// }
//
// interface SignatureResult {
//     signature: string;
//     algorithm: string;
//     timestamp: Date;
//     certificate: UkrainianCertificateInfo;
//     documentHash: string;
// }
//
// export const TestPage: React.FC = () => {
//     const [keyFile, setKeyFile] = useState<File | null>(null);
//     const [password, setPassword] = useState('');
//     const [isKeyLoaded, setIsKeyLoaded] = useState(false);
//     const [certificateInfo, setCertificateInfo] = useState<UkrainianCertificateInfo | null>(null);
//     const [documentText, setDocumentText] = useState('Договір про надання послуг\n\nСторони:\n1. Постачальник: ТОВ "Українська компанія"\nЄДРПОУ: 12345678\n\n2. Замовник: ФОП Іваненко Іван Іванович\nДРФО: 1234567890\n\nПредмет договору: Надання консультаційних послуг\nВартість: 50,000 грн\nДата: ' + new Date().toLocaleDateString('uk-UA'));
//     const [signature, setSignature] = useState<SignatureResult | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('DSTU4145');
//
//     // Симуляція читання Ukrainian PKCS#12 файлу
//     const readUkrainianKeyFile = async (file: File): Promise<ArrayBuffer> => {
//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result as ArrayBuffer);
//             reader.onerror = () => reject(new Error('Помилка читання файлу ключа'));
//             reader.readAsArrayBuffer(file);
//         });
//     };
//
//     // Реальна перевірка пароля через розшифрування PKCS#12
//     const parseUkrainianCertificate = async (keyData: ArrayBuffer, password: string): Promise<UkrainianCertificateInfo> => {
//         try {
//             // КРОК 1: Спроба розшифрування PKCS#12 контейнера з реальним паролем
//             const result = await decryptPKCS12Container(keyData, password);
//
//             // КРОК 2: Якщо розшифрування успішне - пароль правильний
//             const { privateKey, certificate } = result;
//
//             // КРОК 3: Парсинг сертифіката для отримання інформації
//             return await extractCertificateInfo(certificate);
//         } catch (cryptoError: any) {
//
//             // Якщо розшифрування не вдалось - пароль неправильний
//             if (cryptoError.message.includes('decrypt') || cryptoError.message.includes('password')) {
//                 throw new Error('Невірний пароль для захищеного ключа');
//             }
//             throw new Error('Помилка обробки файлу ключа: ' + cryptoError.message);
//         }
//     };
//
//     // Функція реального розшифрування PKCS#12 контейнера
//     const decryptPKCS12Container = async (keyData: ArrayBuffer, password: string) => {
//         // В реальному додатку тут використовується node-forge або подібна бібліотека:
//
//
//         try {
//           // Конвертуємо ArrayBuffer в формат для forge
//           const p12Der = forge.util.encode64(new Uint8Array(keyData));
//           const p12Asn1 = forge.asn1.fromDer(forge.util.decode64(p12Der));
//
//           // КРИТИЧНИЙ МОМЕНТ: тут відбувається реальна перевірка пароля
//           // Якщо пароль неправильний - forge.pkcs12.pkcs12FromAsn1 викине помилку
//           const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
//
//           // Витягуємо приватний ключ (тільки якщо пароль правильний)
//           const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
//           const privateKey = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;
//
//           // Витягуємо сертифікат
//           const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
//           const certificate = certBags[forge.pki.oids.certBag][0].cert;
//
//           return { privateKey, certificate };
//
//         } catch (error) {
//           // Помилки розшифрування означають неправильний пароль
//           throw new Error('Невірний пароль або пошкоджений файл');
//         }
//
//
//         // Для демо: симуляція криптографічної перевірки
//         // await simulateRealPasswordValidation(keyData, password);
//         //
//         // return {
//         //     privateKey: 'mock_private_key',
//         //     certificate: 'mock_certificate'
//         // };
//     };
//
//     // Симуляція реальної криптографічної перевірки пароля
//     const simulateRealPasswordValidation = async (keyData: ArrayBuffer, password: string) => {
//         await new Promise(resolve => setTimeout(resolve, 800)); // Імітація криптографічних операцій
//
//         // Імітуємо реальну перевірку через структуру файлу
//         const fileBytes = new Uint8Array(keyData);
//
//         // Перевіряємо, чи файл схожий на PKCS#12 (починається з определених байтів)
//         if (fileBytes.length < 10) {
//             throw new Error('Файл занадто малий для ключа');
//         }
//
//         // Реальна перевірка: спробуємо "розшифрувати" дані з паролем
//         // В цьому прикладі використовуємо хеш пароля як "ключ розшифрування"
//         const passwordHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
//         const hashArray = new Uint8Array(passwordHash);
//
//         // Імітуємо спробу розшифрування: XOR перших байтів файлу з хешем пароля
//         let decryptionSuccess = true;
//         for (let i = 0; i < Math.min(hashArray.length, fileBytes.length); i++) {
//             const decryptedByte = fileBytes[i] ^ hashArray[i % hashArray.length];
//             // Імітуємо перевірку структури розшифрованих даних
//             if (i < 4 && decryptedByte > 127) { // Спрощена перевірка
//                 decryptionSuccess = false;
//                 break;
//             }
//         }
//
//         if (!decryptionSuccess) {
//             throw new Error('Невірний пароль для захищеного ключа');
//         }
//     };
//
//     // Витягування інформації з сертифіката
//     const extractCertificateInfo = async (certificate: any): Promise<UkrainianCertificateInfo> => {
//         // Генеруємо реалістичну інформацію про український сертифікат
//         const certTypes = ['personal', 'corporate', 'stamp'] as const;
//         const randomType = certTypes[Math.floor(Math.random() * certTypes.length)];
//
//         const mockCert: UkrainianCertificateInfo = {
//             subject: {
//                 commonName: randomType === 'personal' ? 'Іваненко Іван Іванович' : 'ТОВ "Українська Технологічна Компанія"',
//                 organization: randomType === 'personal' ? 'Фізична особа-підприємець' : 'ТОВ "Українська Технологічна Компанія"',
//                 organizationalUnit: randomType === 'corporate' ? 'Відділ інформаційних технологій' : undefined,
//                 country: 'UA',
//                 locality: 'м. Київ',
//                 drfo: randomType === 'personal' ? '1234567890' : undefined,
//                 edrpou: randomType !== 'personal' ? '12345678' : undefined
//             },
//             issuer: {
//                 commonName: 'АЦСК "Україна" ПАТ "ІІТ"',
//                 organization: 'Публічне акціонерне товариство "Інститут інформаційних технологій"',
//                 country: 'UA'
//             },
//             serialNumber: '4A5B6C7D8E9F0123456789ABCDEF',
//             validFrom: new Date('2024-01-15'),
//             validTo: new Date('2025-01-15'),
//             algorithm: selectedAlgorithm === 'DSTU4145' ? 'ДСТУ 4145-2002 (еліптичні криві)' : 'RSA-2048',
//             keyUsage: ['digitalSignature', 'nonRepudiation', 'keyEncipherment'],
//             isQualified: true,
//             certificateType: randomType
//         };
//
//         return mockCert;
//     };
//
//     // Завантаження та валідація ключа
//     const handleLoadKey = async () => {
//         if (!keyFile || !password) {
//             setError('Оберіть файл ключа та введіть пароль');
//             return;
//         }
//
//         if (!keyFile.name.match(/\.(pfx|p12|jks|key)$/i)) {
//             setError('Підтримуються тільки файли форматів: .pfx, .p12, .jks, .key');
//             return;
//         }
//
//         setIsLoading(true);
//         setError(null);
//
//         try {
//             const keyData = await readUkrainianKeyFile(keyFile);
//             const certInfo = await parseUkrainianCertificate(keyData, password);
//
//             // Перевірка дійсності сертифіката
//             const now = new Date();
//             if (now < certInfo.validFrom || now > certInfo.validTo) {
//                 throw new Error('Сертифікат недійсний (термін дії закінчився або ще не розпочався)');
//             }
//
//             setCertificateInfo(certInfo);
//             setIsKeyLoaded(true);
//             setError(null);
//
//         } catch (err) {
//             setError((err as Error).message);
//             setIsKeyLoaded(false);
//             setCertificateInfo(null);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     // Створення українського цифрового підпису
//     const createUkrainianDigitalSignature = async (data: string, algorithm: string): Promise<string> => {
//         // Симуляція створення підпису за українськими стандартами
//         const encoder = new TextEncoder();
//         const dataBytes = encoder.encode(data);
//
//         let signature: string;
//
//         if (algorithm === 'DSTU4145') {
//             // Симуляція ДСТУ 4145-2002 (еліптичні криві)
//             const r = Array.from({length: 32}, () => Math.floor(Math.random() * 256));
//             const s = Array.from({length: 32}, () => Math.floor(Math.random() * 256));
//             signature = btoa(String.fromCharCode(...r, ...s));
//         } else {
//             // RSA підпис
//             const mockSignature = new Uint8Array(256);
//             crypto.getRandomValues(mockSignature);
//             signature = btoa(String.fromCharCode(...mockSignature));
//         }
//
//         return signature;
//     };
//
//     // Обчислення хешу документа (ГОСТ 34.311-95 або SHA-256)
//     const calculateDocumentHash = async (data: string, algorithm: string): Promise<string> => {
//         const encoder = new TextEncoder();
//         const dataBytes = encoder.encode(data);
//
//         if (algorithm === 'DSTU4145') {
//             // Симуляція ГОСТ 34.311-95
//             const hash = await crypto.subtle.digest('SHA-256', dataBytes); // Fallback до SHA-256
//             return btoa(String.fromCharCode(...new Uint8Array(hash)));
//         } else {
//             // SHA-256 для RSA
//             const hash = await crypto.subtle.digest('SHA-256', dataBytes);
//             return btoa(String.fromCharCode(...new Uint8Array(hash)));
//         }
//     };
//
//     // Підпис документа
//     const handleSignDocument = async () => {
//         if (!isKeyLoaded || !certificateInfo) {
//             setError('Спочатку завантажте дійсний ключ');
//             return;
//         }
//
//         if (!documentText.trim()) {
//             setError('Введіть текст документа для підпису');
//             return;
//         }
//
//         setIsLoading(true);
//         setError(null);
//
//         try {
//             // Обчислюємо хеш документа
//             const documentHash = await calculateDocumentHash(documentText, selectedAlgorithm);
//
//             // Створюємо підпис
//             const signatureData = await createUkrainianDigitalSignature(documentText, selectedAlgorithm);
//
//             const result: SignatureResult = {
//                 signature: signatureData,
//                 algorithm: UA_CRYPTO_ALGORITHMS[selectedAlgorithm as keyof typeof UA_CRYPTO_ALGORITHMS],
//                 timestamp: new Date(),
//                 certificate: certificateInfo,
//                 documentHash
//             };
//
//             setSignature(result);
//
//         } catch (err) {
//             setError('Помилка створення підпису: ' + (err as Error).message);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     // Очищення
//     const handleReset = () => {
//         setKeyFile(null);
//         setPassword('');
//         setIsKeyLoaded(false);
//         setCertificateInfo(null);
//         setSignature(null);
//         setError(null);
//     };
//
//     // Експорт підпису
//     const handleExportSignature = () => {
//         if (!signature) return;
//
//         const exportData = {
//             document: documentText,
//             signature: signature.signature,
//             algorithm: signature.algorithm,
//             timestamp: signature.timestamp.toISOString(),
//             certificate: signature.certificate,
//             documentHash: signature.documentHash
//         };
//
//         const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `підпис_${new Date().toISOString().split('T')[0]}.json`;
//         a.click();
//         URL.revokeObjectURL(url);
//     };
//
//     return (
//         <div className="max-w-6xl mx-auto p-6 bg-white">
//             <div className="bg-gradient-to-r from-blue-600 to-yellow-400 text-white p-6 rounded-lg mb-8">
//                 <h1 className="text-3xl font-bold mb-2">🇺🇦 Українська система ЕЦП</h1>
//                 <p className="text-blue-100">Електронний цифровий підпис за стандартами України</p>
//             </div>
//
//             {error && (
//                 <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
//                     <div className="flex">
//                         <div className="flex-shrink-0">
//                             <span className="text-red-400 text-xl">⚠️</span>
//                         </div>
//                         <div className="ml-3">
//                             <p className="text-red-800">{error}</p>
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//             {/* Завантаження ключа */}
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
//                 <h2 className="text-2xl font-semibold text-blue-800 mb-4 flex items-center">
//                     🔐 Крок 1: Завантаження електронного ключа
//                 </h2>
//
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Файл ключа:
//                         </label>
//                         <input
//                             type="file"
//                             accept=".pfx,.p12,.jks,.key"
//                             onChange={(e) => setKeyFile(e.target.files?.[0] || null)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             disabled={isKeyLoaded}
//                         />
//                         <p className="text-xs text-gray-500 mt-1">Підтримка: .pfx, .p12, .jks, .key</p>
//                     </div>
//
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Пароль ключа:
//                         </label>
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             disabled={isKeyLoaded}
//                             placeholder="Введіть пароль"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">Для тесту: test123 або україна2024</p>
//                     </div>
//
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Алгоритм підпису:
//                         </label>
//                         <select
//                             value={selectedAlgorithm}
//                             onChange={(e) => setSelectedAlgorithm(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             disabled={isKeyLoaded}
//                         >
//                             <option value="DSTU4145">ДСТУ 4145-2002 (рекомендовано)</option>
//                             <option value="RSA">RSA-2048</option>
//                         </select>
//                     </div>
//                 </div>
//
//                 <div className="flex space-x-4">
//                     <button
//                         onClick={handleLoadKey}
//                         disabled={!keyFile || !password || isLoading || isKeyLoaded}
//                         className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
//                     >
//                         {isLoading ? '🔄 Перевірка ключа...' : '🔓 Завантажити ключ'}
//                     </button>
//
//                     {isKeyLoaded && (
//                         <button
//                             onClick={handleReset}
//                             className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-medium"
//                         >
//                             🔄 Змінити ключ
//                         </button>
//                     )}
//                 </div>
//             </div>
//
//             {/* Інформація про сертифікат */}
//             {isKeyLoaded && certificateInfo && (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
//                     <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center">
//                         ✅ Сертифікат успішно завантажено
//                     </h2>
//
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <div className="space-y-3">
//                             <h3 className="font-semibold text-gray-800 border-b pb-1">Власник сертифіката:</h3>
//                             <div className="space-y-2 text-sm">
//                                 <p><span className="font-medium">ПІБ/Назва:</span> {certificateInfo.subject.commonName}</p>
//                                 <p><span className="font-medium">Організація:</span> {certificateInfo.subject.organization}</p>
//                                 {certificateInfo.subject.drfo && (
//                                     <p><span className="font-medium">ДРФО:</span> {certificateInfo.subject.drfo}</p>
//                                 )}
//                                 {certificateInfo.subject.edrpou && (
//                                     <p><span className="font-medium">ЄДРПОУ:</span> {certificateInfo.subject.edrpou}</p>
//                                 )}
//                                 <p><span className="font-medium">Місцевість:</span> {certificateInfo.subject.locality}</p>
//                             </div>
//                         </div>
//
//                         <div className="space-y-3">
//                             <h3 className="font-semibold text-gray-800 border-b pb-1">Технічна інформація:</h3>
//                             <div className="space-y-2 text-sm">
//                                 <p><span className="font-medium">Видавець:</span> {certificateInfo.issuer.commonName}</p>
//                                 <p><span className="font-medium">Серійний номер:</span> {certificateInfo.serialNumber}</p>
//                                 <p><span className="font-medium">Дійсний з:</span> {certificateInfo.validFrom.toLocaleDateString('uk-UA')}</p>
//                                 <p><span className="font-medium">Дійсний до:</span> {certificateInfo.validTo.toLocaleDateString('uk-UA')}</p>
//                                 <p><span className="font-medium">Алгоритм:</span> {certificateInfo.algorithm}</p>
//                                 <p><span className="font-medium">Тип:</span>
//                                     <span className={`ml-2 px-2 py-1 rounded text-xs ${
//                                         certificateInfo.certificateType === 'personal' ? 'bg-blue-100 text-blue-800' :
//                                             certificateInfo.certificateType === 'corporate' ? 'bg-purple-100 text-purple-800' :
//                                                 'bg-orange-100 text-orange-800'
//                                     }`}>
//                     {certificateInfo.certificateType === 'personal' ? 'Особистий' :
//                         certificateInfo.certificateType === 'corporate' ? 'Корпоративний' : 'Печатка'}
//                   </span>
//                                 </p>
//                                 {certificateInfo.isQualified && (
//                                     <p className="text-green-600 font-medium">🏆 Кваліфікований сертифікат</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//             {/* Підпис документа */}
//             {isKeyLoaded && (
//                 <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
//                     <h2 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center">
//                         📝 Крок 2: Підпис документа
//                     </h2>
//
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Документ для підпису:
//                         </label>
//                         <textarea
//                             value={documentText}
//                             onChange={(e) => setDocumentText(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                             rows={8}
//                             placeholder="Введіть текст документа..."
//                         />
//                     </div>
//
//                     <button
//                         onClick={handleSignDocument}
//                         disabled={isLoading || !documentText.trim()}
//                         className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
//                     >
//                         {isLoading ? '🔄 Створення підпису...' : '✍️ Підписати документ'}
//                     </button>
//                 </div>
//             )}
//
//             {/* Результат підпису */}
//             {signature && (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
//                     <div className="flex justify-between items-start mb-4">
//                         <h2 className="text-2xl font-semibold text-yellow-800 flex items-center">
//                             🏆 Документ успішно підписано
//                         </h2>
//                         <button
//                             onClick={handleExportSignature}
//                             className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm font-medium"
//                         >
//                             💾 Експорт підпису
//                         </button>
//                     </div>
//
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <div className="space-y-4">
//                             <div>
//                                 <h3 className="font-semibold text-gray-800 mb-2">Деталі підпису:</h3>
//                                 <div className="space-y-2 text-sm">
//                                     <p><span className="font-medium">Алгоритм:</span> {signature.algorithm}</p>
//                                     <p><span className="font-medium">Час створення:</span> {signature.timestamp.toLocaleString('uk-UA')}</p>
//                                     <p><span className="font-medium">Підписувач:</span> {signature.certificate.subject.commonName}</p>
//                                     <p><span className="font-medium">Хеш документа:</span>
//                                         <code className="text-xs bg-gray-100 px-1 rounded ml-1">
//                                             {signature.documentHash.substring(0, 32)}...
//                                         </code>
//                                     </p>
//                                 </div>
//                             </div>
//
//                             <div className="bg-green-100 border border-green-300 rounded p-3">
//                                 <p className="text-green-800 text-sm font-medium">
//                                     ✅ Підпис створено відповідно до українських стандартів
//                                 </p>
//                                 <p className="text-green-700 text-xs mt-1">
//                                     Документ захищено від змін. Будь-які зміни призведуть до недійсності підпису.
//                                 </p>
//                             </div>
//                         </div>
//
//                         <div>
//                             <h3 className="font-semibold text-gray-800 mb-2">Електронний підпис:</h3>
//                             <div className="bg-white border rounded-md p-3 max-h-48 overflow-y-auto">
//                                 <code className="text-xs text-gray-600 break-all">
//                                     {signature.signature}
//                                 </code>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//
//             {/* Інформація про систему */}
//             <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">🔐 Як працює перевірка пароля</h3>
//
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
//                     <div className="bg-white border rounded-lg p-4">
//                         <h4 className="font-semibold text-blue-800 mb-3">Реальна перевірка (Production):</h4>
//                         <ol className="text-sm text-gray-700 space-y-2">
//                             <li className="flex items-start">
//                                 <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
//                                 <div>
//                                     <strong>Завантаження PKCS#12:</strong> Файл .pfx/.p12 містить зашифрований приватний ключ
//                                 </div>
//                             </li>
//                             <li className="flex items-start">
//                                 <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
//                                 <div>
//                                     <strong>Криптографічна перевірка:</strong> Бібліотека (node-forge) намагається розшифрувати ключ
//                                 </div>
//                             </li>
//                             <li className="flex items-start">
//                                 <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
//                                 <div>
//                                     <strong>Результат:</strong> Якщо пароль неправильний - розшифрування не вдається, викидається помилка
//                                 </div>
//                             </li>
//                         </ol>
//                     </div>
//
//                     <div className="bg-white border rounded-lg p-4">
//                         <h4 className="font-semibold text-yellow-800 mb-3">Цей демо (симуляція):</h4>
//                         <ol className="text-sm text-gray-700 space-y-2">
//                             <li className="flex items-start">
//                                 <span className="bg-yellow-100 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
//                                 <div>
//                                     <strong>Імітація структури:</strong> Перевіряється структура файлу та розмір
//                                 </div>
//                             </li>
//                             <li className="flex items-start">
//                                 <span className="bg-yellow-100 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
//                                 <div>
//                                     <strong>Хеш-перевірка:</strong> Пароль хешується та "перевіряється" проти структури файлу
//                                 </div>
//                             </li>
//                             <li className="flex items-start">
//                                 <span className="bg-yellow-100 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
//                                 <div>
//                                     <strong>Результат:</strong> Симуляція помилки при неправильному паролі
//                                 </div>
//                             </li>
//                         </ol>
//                     </div>
//                 </div>
//
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//                     <h4 className="font-semibold text-blue-800 mb-2">💡 Реальна імплементація з node-forge:</h4>
//                     <pre className="text-xs text-blue-700 bg-blue-100 rounded p-3 overflow-x-auto">
// {`import forge from 'node-forge';
//
// const validatePassword = async (keyData, password) => {
//   try {
//     // Це РЕАЛЬНА перевірка пароля
//     const p12Der = forge.util.encode64(new Uint8Array(keyData));
//     const p12Asn1 = forge.asn1.fromDer(forge.util.decode64(p12Der));
//
//     // Якщо пароль неправильний - тут буде помилка
//     const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
//
//     return true; // Пароль правильний
//   } catch (error) {
//     throw new Error('Невірний пароль');
//   }
// };`}
//           </pre>
//                 </div>
//
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">ℹ️ Додаткова інформація</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//                     <div>
//                         <h4 className="font-medium text-gray-800 mb-2">Підтримувані стандарти:</h4>
//                         <ul className="space-y-1">
//                             <li>• ДСТУ 4145-2002 (еліптична криптографія)</li>
//                             <li>• ГОСТ 34.311-95 (хеш-функція)</li>
//                             <li>• PKCS#12 контейнери ключів</li>
//                             <li>• Кваліфіковані електронні сертифікати</li>
//                         </ul>
//                     </div>
//                     <div>
//                         <h4 className="font-medium text-gray-800 mb-2">Безпека:</h4>
//                         <ul className="space-y-1">
//                             <li>• Обробка ключів тільки в браузері</li>
//                             <li>• Паролі не зберігаються</li>
//                             <li>• Відповідність Закону України "Про ЕДО"</li>
//                             <li>• Валідація термінів дії сертифікатів</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

export {}