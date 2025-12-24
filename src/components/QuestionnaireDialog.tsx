
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useShop } from "@/providers/ShopProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Users, Search, HelpCircle, Zap, Clock, RotateCw, MessageSquare, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionnaireDialogProps {
    orderId: string;
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function QuestionnaireDialog({ orderId, userId, open, onOpenChange }: QuestionnaireDialogProps) {
    const { addQuestionnaire, questionnaires } = useShop();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const existingSurvey = questionnaires?.find(q => q.order_id === orderId);
    const isDone = !!existingSurvey;

    if (isDone) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-lg font-bold text-green-600 flex flex-col items-center gap-2">
                            <span className="text-4xl">🎉</span>
                            Terima Kasih!
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-6 text-muted-foreground">
                        <p>Anda sudah mengisi survey untuk pesanan ini.</p>
                        <p className="text-sm mt-2">Masukan Anda sangat berharga bagi kami.</p>
                    </div>
                    <div className="flex justify-center">
                        <Button onClick={() => onOpenChange(false)}>Tutup</Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await addQuestionnaire({
                orderId,
                userId,
                answers
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setStep(step + 1);
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    }

    const selectionOption = (value: string, label: string, icon: React.ReactNode, current: string, onChange: (v: string) => void) => (
        <div
            onClick={() => onChange(value)}
            className={cn(
                "relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:bg-slate-50",
                current === value
                    ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                    : "border-slate-100 bg-white hover:border-slate-300"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                current === value ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
            )}>
                {icon}
            </div>
            <div className="flex-1">
                <span className={cn("font-medium text-sm sm:text-base block", current === value ? "text-amber-900" : "text-slate-700")}>
                    {label}
                </span>
            </div>
            {current === value && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="w-5 h-5 text-amber-500 fill-amber-100" />
                </motion.div>
            )}
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white border-none shadow-2xl gap-0">
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100">
                    <motion.div
                        className="h-full bg-amber-500"
                        initial={{ width: "33%" }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <div className="p-6">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-amber-500" />
                            Bantu Kami Menjadi Lebih Baik
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Langkah {step} dari 3 &mdash; Pendapat Anda sangat berarti bagi kami.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="min-h-[320px]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <Label className="text-base font-semibold text-slate-800">1. Dari mana Anda mengetahui tentang ZonaPrint?</Label>
                                    <div className="grid grid-cols-1 gap-3 pt-2">
                                        {selectionOption("instagram", "Instagram", <Instagram className="w-5 h-5" />, answers.source, (v) => setAnswers({ ...answers, source: v }))}
                                        {selectionOption("friend", "Teman / Keluarga", <Users className="w-5 h-5" />, answers.source, (v) => setAnswers({ ...answers, source: v }))}
                                        {selectionOption("search", "Google Search", <Search className="w-5 h-5" />, answers.source, (v) => setAnswers({ ...answers, source: v }))}
                                        {selectionOption("other", "Lainnya", <HelpCircle className="w-5 h-5" />, answers.source, (v) => setAnswers({ ...answers, source: v }))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <Label className="text-base font-semibold text-slate-800">2. Seberapa puas Anda dengan kecepatan layanan kami?</Label>
                                    <div className="grid grid-cols-1 gap-3 pt-2">
                                        {selectionOption("very_fast", "Sangat Cepat", <Zap className="w-5 h-5" />, answers.speed, (v) => setAnswers({ ...answers, speed: v }))}
                                        {selectionOption("fast", "Cepat", <Zap className="w-5 h-5" />, answers.speed, (v) => setAnswers({ ...answers, speed: v }))}
                                        {selectionOption("normal", "Biasa Saja", <Clock className="w-5 h-5" />, answers.speed, (v) => setAnswers({ ...answers, speed: v }))}
                                        {selectionOption("slow", "Lambat", <RotateCw className="w-5 h-5" />, answers.speed, (v) => setAnswers({ ...answers, speed: v }))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <Label className="text-base font-semibold text-slate-800">3. Apa yang bisa kami tingkatkan?</Label>
                                    <Textarea
                                        className="min-h-[150px] resize-none border-slate-200 focus:border-amber-500 transition-all text-base p-4 focus:ring-amber-500/20"
                                        placeholder="Berikan saran atau masukan Anda disini..."
                                        value={answers.feedback || ""}
                                        onChange={(e) => setAnswers({ ...answers, feedback: e.target.value })}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <DialogFooter className="mt-6 flex flex-row items-center justify-between sm:justify-between gap-4">
                        {step === 1 ? (
                            <Button variant="ghost" className="text-slate-400 hover:text-slate-600 hover:bg-slate-100" onClick={() => onOpenChange(false)}>Nanti Saja</Button>
                        ) : (
                            <Button variant="outline" onClick={handleBack} className="border-slate-200 hover:bg-slate-50 text-slate-600">Kembali</Button>
                        )}

                        {step < 3 ? (
                            <Button className="bg-amber-600 hover:bg-amber-700 min-w-[120px] shadow-lg shadow-amber-600/20" onClick={handleNext} disabled={step === 1 && !answers.source || step === 2 && !answers.speed}>
                                Lanjut
                            </Button>
                        ) : (
                            <Button className="bg-amber-600 hover:bg-amber-700 min-w-[120px] shadow-lg shadow-amber-600/20" onClick={handleSubmit} disabled={loading || !answers.feedback || !answers.feedback.trim()}>
                                {loading ? "Mengirim..." : "Kirim Jawaban"}
                            </Button>
                        )}
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
