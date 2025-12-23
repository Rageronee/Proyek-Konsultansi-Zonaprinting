import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">Hubungi kami</p>
        <h1 className="text-4xl font-bold">Kami siap mendengar kebutuhan Anda</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Kirim pesan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Nama lengkap" />
              <Input placeholder="Email" />
            </div>
            <Input placeholder="Subjek" />
            <Textarea placeholder="Ceritakan kebutuhan cetak Anda" rows={5} />
            <Button type="button">Kirim</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kontak langsung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" />
              <span>+62 811-8894-690 (Purwakarta)</span>
              <span>+62 822-4690-7899 (Wanayasa)</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" />
              <span>zonaprintwanayasa@gmail.com</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-primary mt-1" />
              <span>Purwakarta, Indonesia</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <p className="font-semibold">Lokasi ZonaPrint Purwakarta</p>
          <div className="relative w-full h-0 pb-[66.6667%] rounded-xl overflow-hidden border">
            <div className="overflow-hidden bg-transparent w-full h-full absolute top-0 left-0">
              <iframe
                className="w-full h-full absolute top-0 left-0"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Zonaprint%20kemuning&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                title="Lokasi ZonaPrint Purwakarta"
              />
              <a
                href="https://classicjoy.games"
                className="text-[2px] text-gray-500 absolute bottom-0 left-0 z-10 max-h-px overflow-hidden"
              >
                Retro Games Online
              </a>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <p className="font-semibold">Lokasi ZonaPrint Wanayasa</p>
          <div className="relative w-full h-0 pb-[66.6667%] rounded-xl overflow-hidden border">
            <div className="overflow-hidden bg-transparent w-full h-full absolute top-0 left-0">
              <iframe
                title="Lokasi ZonaPrint Wanayasa"
                src="https://maps.google.com/maps?width=600&height=400&hl=en&q=zona%20printing%20wanayasa&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                className="w-full h-full absolute top-0 left-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

